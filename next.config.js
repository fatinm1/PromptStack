/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  // Disable static generation for authenticated pages
  experimental: {
    // This ensures pages are rendered on-demand
    workerThreads: false,
    cpus: 1
  }
}

module.exports = nextConfig 