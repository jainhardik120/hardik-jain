import { getAllPosts } from "@/lib/actions/getAllPosts";
import Link from "next/link";

export default async function BlogSection() {
  const blogs = await getAllPosts(0, 3);
  return (
    <>
      <section id="blog">
        <h2 className="text-center text-4xl font-bold mt-4 mb-8 md:mb-12">
          Blog
        </h2>
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {blogs.map(blog =>
              <Link key={blog.id} href={`/post/${blog.id}`}>
                <h3 className="text-2xl font-bold tracking-tight">
                  {blog.title}
                </h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  {blog.description}
                </p>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Published on {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </Link>
            )}
          </div>
          <div className="mt-8 flex justify-center">
            <Link
              href="/blog"
              className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
              prefetch={false}
            >
              View All Blog Posts
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}