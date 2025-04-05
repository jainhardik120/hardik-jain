import { notFound } from 'next/navigation';

import { getPageCount } from '@/actions/blog';
import PostCard from '@/components/post-card';
import { api } from '@/server/api/server';

import PageSwitch from './PageSwitch';

import type { Metadata } from 'next';

export const revalidate = 1800;

export const metadata: Metadata = {
  // eslint-disable-next-line quotes
  title: "Hardik Jain's Blog | Android & Web Dev Insights",
  description:
    'Explore in-depth articles, project showcases, and tech insights from Hardik Jain, an experienced Android & Web Developer.',
};

export async function generateStaticParams(): Promise<{ page: string }[]> {
  const pageCount = await getPageCount();

  return Array.from({ length: pageCount }, (_, i) => ({
    page: (i + 1).toString(),
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<JSX.Element> {
  const pageCount = await getPageCount();
  const posts = await api.post.getAllPosts({
    offset: (parseInt((await params).page) - 1) * 10,
  });
  if (posts.length === 0) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4">Latest Articles</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore in-depth articles, project showcases, and tech insights from Hardik Jain, an
          experienced Android & Web Developer.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      <PageSwitch totalPages={pageCount} currentPage={parseInt((await params).page)} />
    </main>
  );
}
