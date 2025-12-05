import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export",
  output: 'standalone',
  transpilePackages: ['@garden/shared'],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;