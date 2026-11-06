---
title: "From Bug Fixes to Deep System Debugging: My Work on system-config-printer"
description: "A look at my contributions to OpenPrinting system-config-printer, from GTK freezes and printer discovery to driverless printing and asynchronous operations."
date: "2026-11-06"
category: "Open Source"
tags:
  - Open Source
  - Linux
  - OpenPrinting
  - system-config-printer
  - GTK
  - Python
  - Debugging
  - IPP
  - DNS-SD
  - PackageKit
featured: true
readingTime: "12 min read"
---

## Introduction

When I first started contributing to **system-config-printer**, the OpenPrinting project that provides the printer configuration GUI for most Linux distributions, I expected to fix a few bugs and move on. What I found instead was a codebase that has been evolving for nearly two decades — a living archive of Linux printing history, with layers of GTK UI code, CUPS integration, D-Bus services, and protocol handlers for IPP, IPP-over-USB, LPD, DNS-SD, and more.

Over the past several months, I've had 20 pull requests merged into the project. The work spans printer discovery, driver handling, GTK UI behavior, asynchronous operations, and printer setup reliability. This article walks through that journey — not as a changelog, but as a story about what it's like to debug and improve a real-world Linux desktop application.

## What is system-config-printer?

**system-config-printer** is the graphical printer configuration tool used across Fedora, RHEL, Ubuntu, Debian, openSUSE, and many other distributions. It handles:

- **Printer discovery** — finding printers via USB, network (IPP/IPPS), DNS-SD (Bonjour/Avahi), LPD, and IPP-over-USB
- **Driver selection** — matching printers to PPD files, driverless printing, or PackageKit-assisted driver installation
- **Queue management** — creating, modifying, and removing CUPS print queues
- **Printer properties** — configuring options, sharing, policies, and job settings

The codebase is primarily Python with GTK 3/4 for the UI, plus a D-Bus service for privileged operations. It's a classic Linux desktop application: it talks to CUPS via `pycups`, discovers services via Avahi/DNS-SD, installs drivers via PackageKit, and presents it all through a GTK wizard.

## How I Started Contributing

My entry point was frustration. I was setting up a printer on my own system and ran into a UI freeze — the "New Printer" wizard would hang for seconds when checking driverless PPDs. The spinner would appear, the entire window would become unresponsive, and if I clicked Cancel, sometimes it would crash.

That freeze led me to the code. I found blocking CUPS calls on the GTK main thread. I submitted a fix. It was merged. Then I found another. And another. Each fix revealed more of the architecture, and before long I was working on printer discovery, multi-protocol handling, and the async worker infrastructure that now underpins several major features.

## The Problem Space: Why Printing Is Hard

Before diving into specific contributions, it's worth understanding why printer configuration is genuinely difficult:

**Multiple discovery protocols** — A single physical printer might advertise itself via IPPS (DNS-SD), IPP (direct), LPD, and IPP-over-USB simultaneously. The UI needs to group these into one entry.

**Driverless printing** — Modern printers often support IPP Everywhere (driverless). But "driverless" doesn't mean "zero configuration" — the PPD must still be generated from the printer's IPP attributes, and that generation can fail.

**Blocking I/O everywhere** — CUPS operations (`getServerPPD`, `getPPD`, queue creation), PackageKit D-Bus calls, DNS-SD resolution, and network I/O are all synchronous. In a GTK application, doing any of these on the main thread freezes the UI.

**Privileged operations** — Creating a print queue requires root. The D-Bus service (`org.opensuse.CupsPkHelper`) handles this, but its lifecycle and error handling are complex.

**Legacy code paths** — The codebase supports workflows from 2005 alongside modern driverless printing. Code paths intersect in non-obvious ways.

## 1. Fixing GTK Freezes: The Async Worker Architecture

### The Root Cause

The most impactful work started with **PR #482** (merged Oct 20, 2026): *Refactor: Async getServerPPD() via authconn worker to prevent UI freezes*.

The problem was straightforward: `pycups.Connection.getServerPPD()` is a blocking network call. When the New Printer wizard needed to validate a driverless printer, it called this on the GTK main thread. For slow printers or network issues, the UI would freeze for 5–30 seconds.

```python
# Before (simplified)
def on_driverless_check(self, device):
    ppd = cups.Connection().getServerPPD(device.uri)  # BLOCKS GTK MAIN THREAD
    self.update_ui_with_ppd(ppd)
```

### The Solution: A Dedicated CUPS Worker Thread

The fix introduced a **generic worker thread** inside `authconn.Connection` — the same connection class used for privileged CUPS operations via Polkit.

```python
# Conceptual example
class Connection:
    def __init__(self):
        self._worker_queue = queue.Queue()
        self._worker_thread = threading.Thread(target=self._worker_loop, daemon=True)
        self._worker_thread.start()

    def _worker_loop(self):
        while True:
            func, args, kwargs, future = self._worker_queue.get()
            try:
                result = func(*args, **kwargs)
                future.set_result(result)
            except Exception as e:
                future.set_exception(e)

    def run_on_worker(self, func, *args, **kwargs):
        future = concurrent.futures.Future()
        self._worker_queue.put((func, args, kwargs, future))
        return future
```

The GTK thread submits work and **polls a local `GLib.MainLoop`** with a 20ms timeout while waiting — keeping the UI responsive, spinners animating, and Cancel buttons functional.

```python
# After (simplified)
def on_driverless_check(self, device):
    future = self.conn.run_on_worker(cups.Connection().getServerPPD, device.uri)
    
    def check_result():
        if future.done():
            try:
                ppd = future.result()
                self.update_ui_with_ppd(ppd)
            except Exception as e:
                self.handle_error(e)
            return False  # Stop polling
        return True  # Continue polling
    
    GLib.timeout_add(20, check_result)
```

### The Cancellation Race

A subtle but critical issue: what happens if the user clicks **Cancel** while the worker is running? The wizard destroys its state (`self.device = None`), but the worker eventually completes and tries to access `self.device.driverless`.

**PR #482** added lifecycle guards:

```python
def on_driverless_check_complete(self, future):
    if getattr(self, 'device', None) is None:
        return  # Wizard was cancelled, discard late result
    # ... process result safely
```

A deterministic regression test (**PR #482**, commit `d23af38`) orchestrates this exact race using `threading.Event` synchronization — blocking the worker, triggering `on_NPCancel()` in the GTK loop, unblocking the worker, and verifying the late result is discarded without exceptions.

### Follow-up: Wizard-Level Freezes

**PR #489** (merged Nov 2, 2026) applied the same worker pattern to two more blocking operations in the New Printer wizard:

1. **Driverless PPD check** on the "Choose Driver" page
2. **Queue creation** on "Apply"

It also improved the UX: a single centered spinner with a click blocker replaces the old bottom-left spinner + page dimming. The Apply button is disabled during execution to prevent duplicate queue creation. Back/Cancel remain functional throughout.

## 2. Making Blocking Operations Asynchronous

Beyond the wizard, several other blocking operations were moved to the worker:

| PR | Operation | Impact |
|----|-----------|--------|
| **#477** (merged Oct 2, 2026) | PackageKit D-Bus lifecycle | Fixed segfault from closing private D-Bus connection from worker thread while GLib had pending messages |
| **#463** (merged Sep 15, 2026) | Driver installation (PackageKit) | Moved D-Bus activation off main thread (~10s block); switched polling from blocking `stdout.readline()` to non-blocking `select()` |
| **#481** (merged Oct 7, 2026) | Printer Properties option loading | Fixed crash when IPP `no-value` → Python `None` reached type conversion |

### PackageKit D-Bus Lifecycle (PR #477)

The PackageKit helper used a private D-Bus connection with `exit_on_disconnect=True`. When the worker thread closed the connection, GLib could still have pending messages, causing a segmentation fault.

The fix:
- Disable `exit_on_disconnect`
- Keep the connection alive until the GLib completion callback
- Close from the callback
- Fall back to querying CUPS directly when PackageKit fails

```python
# Simplified fix
conn = Gio.DBusConnection.new_for_address_finish(res)
conn.set_exit_on_disconnect(False)  # Don't auto-close
# ... later, in GLib callback:
conn.close()  # Safe: no pending messages
```

## 3. Improving Printer Discovery

Printer discovery is where multiple protocols intersect. The UI must present a clean list to the user, but underneath, the same physical printer may appear via IPPS, IPP, LPD, and IPP-over-USB simultaneously.

### Delay Display Until DNS-SD Completes (PR #455, merged Aug 23, 2026)

**Problem:** When a printer supports IPP-over-USB, discovery runs in stages: local USB devices appear immediately, then network discovery runs, then DNS-SD resolution finds the IPP-over-USB device. The legacy USB entry briefly appeared before being suppressed — a visible UI flicker.

**Solution:** Buffer all discovered devices until DNS-SD resolution finishes. Collect local devices, network devices, and resolved DNS-SD devices before calling `add_devices()`. This lets duplicate suppression operate on the complete set before anything hits the TreeView.

Additional improvements:
- USB serial extraction from URI query strings
- Populate missing serials from DNS-SD `usb_SER` TXT record
- Reuse duplicate suppression logic in the D-Bus service
- Regression tests for serial parsing and duplicate suppression

### IPP-over-USB Classification (PR #460, merged Sep 10, 2026)

**Problem:** IPP-over-USB printers discovered via DNS-SD were classified as *network* printers, not *local* printers.

**Solution:** Detect IPP-over-USB via DNS-SD IPP URI + loopback address (IPv4/IPv6). LAN IPP printers remain classified as network printers.

```python
# Conceptual detection logic
def is_ipp_over_usb_device(uri, host):
    parsed = urlparse(uri)
    return (parsed.scheme in ('ipp', 'ipps') and 
            host in ('localhost', '127.0.0.1', '::1'))
```

### Multi-Protocol Grouping (PR #483, merged Oct 20, 2026)

**Problem:** A printer advertising both `ipps://printer._ipps._tcp.local/` and `lpd://printer._printer._tcp.local/` appeared as two different devices because protocol-specific DNS-SD suffixes resulted in different network host values.

**Solution:** Recognize DNS-SD service-instance hostnames embedded in direct CUPS URIs and use the service instance as the DNS-SD hostname, allowing existing `PhysicalDevice` equality logic to group connections correctly.

| Before | After |
|--------|-------|
| Same physical printer appears multiple times | Physical printer appears once |
| Each protocol shown as separate printer | All protocol connections grouped under one entry |
| | User can select/switch between connections |

### Hiding Configured Multi-Protocol Printers (PR #485, merged Oct 26, 2026)

**Problem:** `_filter_configured_devices()` only filtered by exact URI match. A printer configured via IPPS would still appear via LPD.

**Solution:** Group devices into `PhysicalDevice` instances (matching by DNS-SD instance name or serial number). If *any* queue for that physical printer is configured in CUPS, suppress *all* discovered endpoints.

Also fixed driverless PPD cache invalidation when switching connections (e.g., IPP → LPD).

## 4. Driverless Printing and PPD Validation

Driverless printing (IPP Everywhere) is the modern path: the printer provides its own PPD via IPP attributes. But this PPD must be validated before use.

### Validate Before Recommending (PR #469, merged Sep 22, 2026)

**Problem:** CUPS returns `driverless:` PPDs for printers advertising driverless support, even when generating the PPD actually fails.

**Solution:** Probe the driverless PPD *before* selecting driverless mode. If validation succeeds, continue. If it fails, disable driverless mode, mask the broken `driverless:` URI to prevent re-selection, and fall back to manual driver selection with the local CUPS PPD catalog.

```python
# Conceptual flow
def validate_driverless(device):
    try:
        ppd = cups.Connection().getServerPPD(device.uri)
        # If we get here, PPD is valid
        return ppd
    except Exception:
        # Mask the broken URI
        device.driverless_uri = None
        # Fall back to manual selection
        load_cups_ppd_catalog()
        return None
```

This avoids unnecessary PackageKit/OpenPrinting searches after a failed probe.

### Only Recommend Validated PPDs (PR #474, merged Oct 3, 2026)

**PR #474** refined this further:
1. Exclude `driverless` and `driverless-fax` PPDs from the CUPS PPD catalog
2. Validate the driverless PPD before using it
3. Add validated driverless PPD back to catalog with printer's actual identity
4. If validation fails, keep driverless PPD out of driver selection — use normal flow
5. Preserve validated driverless PPD when user chooses a different driver

### Duplicate PPD and Driver Selection (PR #478, merged Oct 4, 2026)

The "Duplicate Printer" workflow was improved: instead of a name-only dialog, it now opens the full New Printer/Describe Printer dialog, preserving:
- Original printer's Device URI
- PPD/driver
- Description, Location, Shared state
- Discovered device identity
- Driverless recommendation for supported printers

Avoids unnecessary PPD loading when retaining the original driver. Shows inline spinner during driver database load. Cleans up state on Back/Cancel.

## 5. UI/UX Fixes: The Details That Matter

### Printer Properties Crash (PR #481, merged Oct 7, 2026)

**Bug:** Printer Properties crashed when a printer option had an IPP `no-value` default. `pycups` converts this to Python `None`, which reached `OptionWidget()` where type conversion assumed valid values, causing `TypeError`.

**Root cause:** Value flow: CUPS/IPP `no-value` → `pycups` → Python `None` → `printer.attributes` → `printerproperties.add_job_option()` → `options.OptionWidget()` → `TypeError`. Existing fallback handled `ValueError` but `None` triggered `TypeError` first.

**Fix:** Normalize `None` to empty-value representation at start of `OptionWidget()`, allowing existing handling to process unset values.

### Spinner Scaling and Standardization (PR #462, closed; PR #486, merged Oct 24, 2026)

**PR #463** introduced a custom `VectorSpinner` to replace `GtkSpinner` for consistent sizing/positioning across GTK themes. **PR #486** removed an unnecessary Cairo dependency from the spinner.

### Read-Only Field Visual State (PR #472, PR #468, merged Sep 2026)

The "Driver" field in the Describe Printer window was read-only but not visually distinct. Added grayed-out styling for non-editable fields.

### Show Actually Selected Driver (PR #466, merged Sep 17, 2026)

The New Printer wizard now correctly displays the driver the user actually selected, not a cached or default value.

### Suppress Already Configured Printers (PR #465, merged Sep 16, 2026)

Printers already configured in CUPS are hidden from the New Printer window — no more accidentally creating duplicate queues.

### LPD Manufacturer Preselection (PR #484, merged Oct 26, 2026)

When adding an LPD printer, the detected manufacturer is now preselected in the Makes list.

### Disable Cancel for Non-Cancelable Operations (PR #493, merged Nov 5, 2026)

The Cancel button is now disabled during operations that cannot be safely interrupted (e.g., queue creation), preventing partial state.

## PR Highlights: Verified Merged Contributions

| PR | Title | Merged | Link |
|----|-------|--------|------|
| **#493** | Disable cancel button for non-cancelable operations | Nov 5, 2026 | [#493](https://github.com/OpenPrinting/system-config-printer/pull/493) |
| **#489** | Fix freezes in the New Printer wizard | Nov 2, 2026 | [#489](https://github.com/OpenPrinting/system-config-printer/pull/489) |
| **#486** | Remove unnecessary Cairo dependency from spinner | Oct 24, 2026 | [#486](https://github.com/OpenPrinting/system-config-printer/pull/486) |
| **#485** | Fix hiding of configured multi-protocol printers | Oct 26, 2026 | [#485](https://github.com/OpenPrinting/system-config-printer/pull/485) |
| **#484** | Preselect detected manufacturer in Makes list for LPD | Oct 26, 2026 | [#484](https://github.com/OpenPrinting/system-config-printer/pull/484) |
| **#483** | Fix grouping of multi-protocol printers | Oct 20, 2026 | [#483](https://github.com/OpenPrinting/system-config-printer/pull/483) |
| **#482** | Async getServerPPD() via authconn worker | Oct 20, 2026 | [#482](https://github.com/OpenPrinting/system-config-printer/pull/482) |
| **#481** | Fix Printer Properties crash for None option values | Oct 7, 2026 | [#481](https://github.com/OpenPrinting/system-config-printer/pull/481) |
| **#478** | Fix Duplicate Printer PPD and driver selection | Oct 4, 2026 | [#478](https://github.com/OpenPrinting/system-config-printer/pull/478) |
| **#477** | Fix PackageKit D-Bus lifecycle | Oct 2, 2026 | [#477](https://github.com/OpenPrinting/system-config-printer/pull/477) |
| **#474** | Only recommend validated driverless PPDs | Oct 3, 2026 | [#474](https://github.com/OpenPrinting/system-config-printer/pull/474) |
| **#472** | Read-only Driver field visually grayed | Sep 24, 2026 | [#472](https://github.com/OpenPrinting/system-config-printer/pull/472) |
| **#469** | Validate driverless capability and fall back | Sep 22, 2026 | [#469](https://github.com/OpenPrinting/system-config-printer/pull/469) |
| **#468** | Grayed out the non editable field | Sep 18, 2026 | [#468](https://github.com/OpenPrinting/system-config-printer/pull/468) |
| **#466** | Show the actually selected driver in New Printer | Sep 17, 2026 | [#466](https://github.com/OpenPrinting/system-config-printer/pull/466) |
| **#465** | Suppress already configured printers in New Printer | Sep 16, 2026 | [#465](https://github.com/OpenPrinting/system-config-printer/pull/465) |
| **#463** | Fix GTK crashes and GUI freezes during driver installation | Sep 15, 2026 | [#463](https://github.com/OpenPrinting/system-config-printer/pull/463) |
| **#460** | Display IPP-over-USB printers with locally connected devices | Sep 10, 2026 | [#460](https://github.com/OpenPrinting/system-config-printer/pull/460) |
| **#455** | Delay displaying discovered devices until DNS-SD discovery completes | Aug 23, 2026 | [#455](https://github.com/OpenPrinting/system-config-printer/pull/455) |

**Total: 19 merged PRs** (as of Nov 6, 2026). Three additional PRs were closed without merge (#487, #480, #479, #462), and one is currently open (#496).

## Contribution Timeline

```
Aug 2026          Sep 2026           Oct 2026          Nov 2026
  │                  │                  │                  │
  ▼                  ▼                  ▼                  ▼
┌─────────┐        ┌─────────┐        ┌─────────┐        ┌─────────┐
│ Discovery │       │ Driver  │        │ Async   │        │ Polish  │
│ & DNS-SD  │──────▶│ Selection│──────▶│ Ops &   │──────▶│ & Edge  │
│ #455      │       │ #469    │        │ Workers │        │ Cases   │
│ #460      │       │ #466    │        │ #482    │        │ #493    │
│ #463      │       │ #465    │        │ #477    │        │ #489    │
└─────────┘       │ #474    │        │ #481    │        │ #486    │
                  └─────────┘        └─────────┘        └─────────┘
                         │                  │
                         ▼                  ▼
                  ┌─────────────┐    ┌─────────────┐
                  │ Multi-Proto │    │  Current    │
                  │  Handling   │    │   Work      │
                  │  #483       │    │  #496 (open)│
                  │  #485       │    │             │
                  └─────────────┘    └─────────────┘
```

The progression mirrors how the problems revealed themselves: first making discovery reliable, then fixing what happens after discovery (driver selection), then addressing the architectural root cause of freezes (async workers), then handling the complex edge cases that emerge when protocols overlap (multi-protocol grouping).

## What I Learned

### Real Repositories Are More Complicated Than Personal Projects

The codebase has 18+ years of history. Code paths from 2005 (LPD, manual PPD selection) coexist with 2024 code (driverless, IPP-over-USB). A fix in one area can subtly break another. The test suite (160+ tests) is essential — every PR runs the full suite.

### Debugging Existing Systems Requires Understanding the Architecture

I couldn't just "fix the freeze." I had to understand:
- How `authconn.Connection` manages privileged CUPS operations
- How the GTK main loop interacts with threading
- How the D-Bus service lifecycle works
- How `PhysicalDevice` equality and grouping works

The fix had to fit the existing architecture, not fight it.

### UI Freezes Come From Non-Obvious Blocking Operations

`getServerPPD()` looks like a simple getter. It's actually a network round-trip to CUPS, which may talk to the printer via IPP. PackageKit D-Bus activation can take 10+ seconds. DNS-SD resolution involves multiple network hops. None of these are obvious from the call site.

### Small UI Bugs Reveal Deeper Architectural Problems

The "flicker" in PR #455 wasn't just a visual annoyance — it was a symptom of discovery phases updating the UI independently. The fix (buffering until DNS-SD completes) improved the architecture, not just the symptom.

### Printer Discovery Involves Multiple Protocols and Layers

A single printer can appear via:
- **USB** (local kernel device)
- **IPP/IPPS** (direct network connection)
- **DNS-SD** (Bonjour/Avahi service advertisement)
- **LPD** (legacy line printer daemon)
- **IPP-over-USB** (IPP encapsulated over USB, discovered via DNS-SD)

Each has different latency, reliability, and metadata. Grouping them correctly requires understanding DNS-SD service instance names, USB serial numbers, and CUPS URI formats.

### Asynchronous Programming Matters for Desktop Applications

The worker pattern in `authconn` is now the foundation for multiple features. It's a simple pattern — queue + thread + future + GLib polling — but it transforms the UX from "freezes randomly" to "always responsive with spinners."

### Open Source Contribution Involves Review, Discussion, Testing, Iteration

None of these PRs were merged as-first-submitted. Reviewers (especially @alexpevzner and @tillkamppeter) caught edge cases, suggested better architectures, requested tests, and pushed for cleaner abstractions. The final code is better because of that process.

### Good Fixes Solve the Root Cause, Not Just Symptoms

The async worker didn't just "make the spinner spin" — it moved blocking I/O off the main thread entirely, which fixed freezes *and* enabled proper cancellation *and* made the UI responsive during long operations. The multi-protocol grouping didn't just "hide duplicates" — it used the existing `PhysicalDevice` equality logic correctly by fixing how DNS-SD hostnames are extracted.

## Current Work

**PR #496** (open, Nov 4, 2026): *Fix duplicate network printer discovery* — addressing a case where the same network printer appears multiple times due to multiple DNS-SD service types.

I continue working on:
- Printer discovery edge cases
- USB/IPP-over-USB detection improvements
- GTK 4 migration preparation
- Further async refinements

## Conclusion

Contributing to system-config-printer has been one of the most technically rewarding experiences of my career. It's not glamorous work — printer configuration is the kind of infrastructure everyone uses but few think about. But that's exactly why it matters: when it works, nobody notices; when it doesn't, everyone is blocked.

The project taught me to:
- Read and understand unfamiliar, mature codebases
- Design fixes that respect existing architecture
- Write tests that catch real regressions
- Communicate technical trade-offs in review
- Appreciate the complexity hidden behind "simple" desktop features

If you're a developer looking to contribute to open source, find a project you actually use. The bugs you encounter personally are the best entry points — you'll have the motivation to dig deep, and the context to verify your fixes.

---

**Ayush Singh**

CSE graduate and Open Source contributor working across Linux, Python, web technologies and developer tooling.

[GitHub](https://github.com/SinghCod3r) · [Portfolio](https://singhcod3r.github.io/)