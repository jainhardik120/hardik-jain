import { api } from '@/server/api/server';
import Link from 'next/link';
import { CalendarIcon, UserIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import PageSwitch from './PageSwitch';
import type { Metadata } from 'next';
import { getPageCount } from '@/actions/blog';
import AppBreadcrumb from '@/app/admin/AppBreadcrumb';
import { notFound } from 'next/navigation';

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
    <>
      <main className="w-full lg:max-w-5xl p-4 mx-auto gap-y-4 flex flex-col">
        <AppBreadcrumb pathname="/blog" />
        <h1>Latest Articles</h1>
        <section className="space-y-10">
          {posts.map((post, index) => (
            <article key={index} className="border-b pb-8 last:border-b-0">
              <Link href={`/post/${post.slug}`} prefetch={false} className="group">
                <h2 className="mb-3">{post.title}</h2>

                <div className="flex items-center text-sm mb-4">
                  <div className="flex items-center mr-4">
                    <UserIcon size={16} className="mr-1" />
                    <span>{post.author.name}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon size={16} className="mr-1" />
                    <time dateTime={new Date(post.createdAt).toISOString()}>
                      {formatDistanceToNow(new Date(post.createdAt), {
                        addSuffix: true,
                      })}
                    </time>
                  </div>
                </div>

                <p className="leading-relaxed mb-4">{post.description}</p>

                <span className="inline-block text-sm font-medium">Read more →</span>
              </Link>
            </article>
          ))}
        </section>
      </main>
      <div className="py-4">
        <PageSwitch pageCount={pageCount} />
      </div>
    </>
  );
}
