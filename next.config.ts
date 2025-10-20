import type { NextConfig } from "next";
import path from "node:path";

const LOADER = path.resolve(__dirname, 'src/visual-edits/component-tagger-loader.js');

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
  outputFileTracingRoot: path.resolve(__dirname, '../../'),
  
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
  
  turbopack: {
    rules: {
      "*.{jsx,tsx}": {
        loaders: [LOADER]
      }
    }
  },
  
  webpack: (config, { dev, isServer }) => {
    // Only apply obfuscation in production client-side builds
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
// Orchids restart: 1759312750652
