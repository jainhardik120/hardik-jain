import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
  },
  async redirects() {
    return [
      {
        source: '/blog',
        destination: '/blog/1',
        permanent: true,
      },
      {
        source: '/post',
        destination: '/blog/1',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'document-export.canva.com',
      },
      {
        protocol: 'https',
        hostname: 'storage.hardikja.in',
      },
    ],
  },
  webpack: (config: Configuration & { externals?: string[] }, { isServer }) => {
    if (isServer) {
      config.externals?.push('esbuild');
    }

    return config;
  },
};

export default nextConfig;
