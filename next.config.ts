import type { NextConfig } from 'next'
import pkg from './package.json'

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_VERSION: pkg.version,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  allowedDevOrigins: ['*'],
  async headers() {
    return [
      {
        source: '/demo-assets/skills/:path*',
        headers: [
          {
            key: 'Content-Disposition',
            value: 'attachment',
          },
        ],
      },
    ]
  },
}

export default nextConfig
