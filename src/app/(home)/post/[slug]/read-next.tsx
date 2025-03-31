import Image from 'next/image';
import Link from 'next/link';

interface Post {
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  createdAt: Date;
  author: {
    name: string | null;
    image: string | null;
  };
}

interface ReadNextProps {
  posts: Post[];
}

export default function ReadNext({ posts }: ReadNextProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-8">Read Next</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link key={post.slug} href={`/post/${post.slug}`} className="group block">
            <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
              <Image
                src={post.coverImage || '/placeholder.svg'}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{post.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
