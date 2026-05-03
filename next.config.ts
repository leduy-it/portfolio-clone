import type { NextConfig } from 'next'

const useDefaultVercelDistDir = process.env.VERCEL === '1'

const nextConfig: NextConfig = {
  distDir:
    process.env.NODE_ENV === 'production' && !useDefaultVercelDistDir
      ? '.next-build'
      : '.next',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'image.tmdb.org' },
    ],
  },
}

export default nextConfig
