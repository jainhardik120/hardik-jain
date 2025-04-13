import Link from 'next/link';

import { Button } from '@repo/ui/button';

import PostCard from '@/components/post-card';
import type { BlogPostWithAuthor } from '@/types';

export default function BlogSection({ blogs }: { blogs: BlogPostWithAuthor[] }) {
  return (
    <section id="blog" className="mx-auto container flex flex-col items-center px-12 py-20">
      <h2 className="text-center mb-12">Blog</h2>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
        {blogs.map((blog) => (
          <div key={blog.id} className="md:w-[350px]">
            <PostCard post={blog} />
          </div>
        ))}
      </div>
      <Link href="/blog" prefetch={false}>
        <Button>View All Blog Posts</Button>
      </Link>
    </section>
  );
}
