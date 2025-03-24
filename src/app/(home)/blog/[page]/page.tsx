import { api } from '@/server/api/server';
import Link from 'next/link';
import PageSwitch from './PageSwitch';
import type { Metadata } from 'next';
import { getPageCount } from '@/actions/blog';
import { notFound } from 'next/navigation';
import Image from 'next/image';

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
        <h1 className="text-4xl font-bold tracking-tight mb-4">Latest Articles</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore in-depth articles, project showcases, and tech insights from Hardik Jain, an
          experienced Android & Web Developer.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post.slug} className="flex flex-col h-full">
            <Link href={`/post/${post.slug}`} className="group">
              <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                <Image
                  src={post.coverImage.length > 0 ? post.coverImage : '/placeholder.svg'}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                {post.title}
              </h2>
            </Link>
            <p className="text-muted-foreground mb-4 flex-grow">{post.description}</p>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center">
                <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                  <Image
                    src={post.author.image ?? '/placeholder.svg'}
                    alt={post.author.name ?? 'Author Name'}
                    fill
                    className="object-cover"
                  />
                </div>
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
        ))}
      </div>

      <PageSwitch totalPages={pageCount} currentPage={parseInt((await params).page)} />
    </main>
  );
}
