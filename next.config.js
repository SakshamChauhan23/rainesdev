const { withSentryConfig } = require('@sentry/nextjs')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for optimized VPS deployment (smaller footprint, faster cold starts)
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudflare.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    // Enable performance optimizations (P3.2)
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Enable CSS optimization and remove console in production (P3.2)
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
}

// Sentry configuration options
const sentryWebpackPluginOptions = {
  // Suppress all logs from the Sentry webpack plugin
  silent: true,

  // Organization and project for uploading source maps
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Auth token for uploading source maps (keep this secret!)
  authToken: process.env.SENTRY_AUTH_TOKEN,
}

// Compose configurations: Bundle Analyzer -> Sentry (P3.1)
let composedConfig = nextConfig

// Apply bundle analyzer
composedConfig = withBundleAnalyzer(composedConfig)

// Apply Sentry if DSN is configured
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  composedConfig = withSentryConfig(composedConfig, sentryWebpackPluginOptions)
}

module.exports = composedConfig
