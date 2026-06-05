import type { NextConfig } from 'next'
import pkg from './package.json'

const nextConfig: NextConfig = {
  output: 'export',
  env: {
    NEXT_PUBLIC_VERSION: pkg.version,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
