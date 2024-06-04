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
  }
});