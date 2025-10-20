import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  
  // Production optimizations & code protection
  productionBrowserSourceMaps: false, // Disable source maps in production
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint during production build
  },
  typescript: {
    ignoreBuildErrors: false, // Keep TypeScript checks
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'], // Keep error & warn logs
    } : false,
  },
  
  webpack: (config, { dev, isServer }) => {
    // Only apply minification in production client-side builds
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        minimizer: [
          ...config.optimization.minimizer || [],
        ],
      };
    }
    
    return config;
  },
};

export default nextConfig;
