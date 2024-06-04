/** @type {import('next').NextConfig} */
import removeImports from "next-remove-imports";

export default removeImports()({
  async redirects() {
    return [
      {
        source : '/blog',
        destination : '/blog/1',
        permanent : true
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
});