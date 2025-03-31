import Link from 'next/link';

import { Button } from '@/components/ui/button';
import type { BlogPostWithAuthor } from '@/types';

export default function BlogSection({ blogs }: { blogs: BlogPostWithAuthor[] }) {
  return (
    <section id="blog" className="profile-section px-12">
      <div className="flex flex-col my-auto gap-12 items-center">
        <h2 className="text-center">Blog</h2>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 max-w-4xl">
          {blogs.map((blog) => (
            <Link key={blog.id} href={`/post/${blog.slug}`}>
              <div className="flex flex-col h-full justify-between overflow-x-hidden">
                <div>
                  <h3 className="tracking-tight">{blog.title}</h3>
                  <p className="mt-2 hidden sm:block text-secondary-foreground">
                    {blog.description}
                  </p>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Published on {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <Link href="/blog/1" prefetch={false}>
          <Button>View All Blog Posts</Button>
        </Link>
      </div>
    </section>
  );
}
