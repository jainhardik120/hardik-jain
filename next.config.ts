import { next } from '@million/lint';
import nextBundleAnalyzer from '@next/bundle-analyzer';

import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
  },
  async redirects() {
    return [
      {
        source: '/post',
        destination: '/blog',
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

const withBundleAnalyzer = nextBundleAnalyzer({
  enabled: process.env['ANALYZE'] === 'true',
})(
  next({
    enabled: false,
  })(nextConfig),
);

export default withBundleAnalyzer;
