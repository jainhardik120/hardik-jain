import type { Metadata } from 'next';
import '@/styles/postcontent.css';

import 'highlight.js/styles/atom-one-dark.css';
import { api } from '@/server/api/server';
import { getPostSlugs } from '@/actions/blog';
import AppBreadcrumb from '@/app/admin/AppBreadcrumb';

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
  const postData = await api.post.getPostContentBySlug({
    slug: (await params).slug,
  });
  if (!postData) {
    return <div>Not Found</div>;
  }

  return (
    <main className="w-full lg:max-w-5xl p-4 mx-auto gap-y-4 flex flex-col">
      <AppBreadcrumb pathname={`/blog/${(await params).slug}`} />

      <h1 className="text-3xl font-semibold">{postData.title}</h1>
      <h2 className="text-xl">{postData.description}</h2>
      <div className="flex flex-col sm:flex-row justify-between">
        <span>
          By <span className="font-bold">{postData.authorName}</span>
        </span>
        <span>{new Date(postData.createdAt).toDateString()}</span>
      </div>
      <hr className="mb-4" />
      {postData.content && (
        <div className="post-content" dangerouslySetInnerHTML={{ __html: postData.content }} />
      )}
    </main>
  );
}
