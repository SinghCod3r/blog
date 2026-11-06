"use client";

import DynamicIslandNav from "./DynamicIslandNav";
import MobileMenuDrawer from "./MobileMenuDrawer";
import { useState, useEffect } from "react";

export default function Header() {
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIntroDone(true);
    } else {
      // Small delay to allow intro animation to complete if present
      const timer = setTimeout(() => setIntroDone(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="pointer-events-auto">
        {/* Dynamic Island Navigation (Desktop) */}
        <DynamicIslandNav visible={introDone} />

        {/* Mobile Menu Drawer */}
        <MobileMenuDrawer />
      </div>
    </header>
  );
}