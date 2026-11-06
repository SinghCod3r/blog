/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/blog',
  assetPrefix: '/blog/',
  trailingSlash: true,
}

module.exports = nextConfig