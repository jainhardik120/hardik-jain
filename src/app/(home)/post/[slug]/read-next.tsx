import PostCard from '@/components/post-card';
import type { BlogPostWithAuthor } from '@/types';

export default function ReadNext({ posts }: { posts: BlogPostWithAuthor[] }) {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-8">Read Next</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
