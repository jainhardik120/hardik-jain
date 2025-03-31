import 'highlight.js/styles/atom-one-dark.css';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getPostSlugs } from '@/actions/blog';
import { api } from '@/server/api/server';

import AuthorCard from './author-card';
import ReadNext from './read-next';
import TableOfContents from './table-of-contents';

import type { Metadata } from 'next';

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
  if (!post) {
    notFound();
  }
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
            <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
              <Image
                src={post.author.image ?? '/placeholder.svg'}
                alt={post.author.name ?? 'Author Name'}
                fill
                className="object-cover"
              />
            </div>
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

        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="lg:w-64 shrink-0">
            <div className="sticky top-24">
              <TableOfContents />
            </div>
          </aside>

          <div className="flex-1">
            <div
              className="prose prose-slate dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-12 pt-8 border-t">
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
