import Image from 'next/image';
import Link from 'next/link';

import { getPostSlugs } from '@/actions/blog';
import RandomAvatarImage from '@/components/avatar-image';
import { Avatar } from '@/components/ui/avatar';
import { api } from '@/server/api/server';

import 'highlight.js/styles/atom-one-dark.css';

import AuthorCard from './author-card';
import CodeHighlight from './code-highlight';
import ReadNext from './read-next';
import TableOfContents from './table-of-contents';

import type { Metadata } from 'next';

export const revalidate = 1800;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const postSlugs = await getPostSlugs();

  return postSlugs;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return (
    (await api.post.getPostMetadata({ slug: (await params).slug })) || {
      title: '',
      description: '',
    }
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<JSX.Element> {
  const post = await api.post.getPostContentBySlug({
    slug: (await params).slug,
  });
  const relatedPosts = await api.post.getRelatedPosts({
    currentSlug: (await params).slug,
    tags: post.tags,
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <article className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center mb-6">
            <Avatar className="h-10 w-10 rounded-full mr-3">
              <RandomAvatarImage src={post.author?.image} alt={post.author?.name} />
            </Avatar>
            <div>
              <p className="font-medium">{post.author.name}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
                {post.readingTime !== null &&
                  post.readingTime !== undefined &&
                  ` · ${post.readingTime} min read`}
              </p>
            </div>
          </div>
          <div className="relative aspect-[21/9] rounded-lg overflow-hidden mb-8">
            <Image
              src={post.coverImage || '/placeholder.svg'}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-x-12">
          <aside className="lg:w-64 shrink-0">
            <div className="sticky top-24">
              <TableOfContents />
            </div>
          </aside>

          <div className="flex-1 mt-8 pt-8 border-t lg:mt-0 lg:pt-0 lg:border-0">
            <CodeHighlight content={post.content} />
            <div className="mt-8 pt-8 border-t">
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/1?tag=${tag}`}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-secondary/80 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>

              <AuthorCard author={post.author} />
            </div>
          </div>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <div className="mt-16">
          <ReadNext posts={relatedPosts} />
        </div>
      )}
    </div>
  );
}
