import type { NextConfig } from 'next'
import pkg from './package.json'

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_VERSION: pkg.version,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // @ts-ignore - eslint config supported at runtime
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
