import Image from 'next/image';
import Link from 'next/link';

import RandomAvatarImage from '@/components/avatar-image';
import { Avatar } from '@/components/ui/avatar';
import type { BlogPostWithAuthor } from '@/types';

const PostCard = ({ post }: { post: BlogPostWithAuthor }) => {
  return (
    <div key={post.slug} className="flex flex-col h-full">
      <Link href={`/post/${post.slug}`} className="group">
        <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
          <Image
            src={post.coverImage.length > 0 ? post.coverImage : '/placeholder.svg'}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
      </Link>
      <p className="text-muted-foreground mb-4 flex-grow">{post.description}</p>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 rounded-full mr-2">
            <RandomAvatarImage src={post.author?.image} alt={post.author?.name} />
          </Avatar>
          <span className="text-sm">{post.author.name}</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      </div>
    </div>
  );
};

export default PostCard;
