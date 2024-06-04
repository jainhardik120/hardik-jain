/** @type {import('next').NextConfig} */

import removeImports from "next-remove-imports";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

export default removeImports()(
  withBundleAnalyzer({
    async redirects() {
      return [
        {
          source: '/blog',
          destination: '/blog/1',
          permanent: true
        }
      ]
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'hardik-jain-blog-content.s3.eu-north-1.amazonaws.com',
          port: '',
          pathname: '/uploads/**',
        },
      ],
    },
  })
);