import type { Metadata } from 'next';
import '@/styles/postcontent.css';

import 'highlight.js/styles/atom-one-dark.css';
import { api } from '@/trpc/server';
import 'highlight.js/styles/atom-one-dark.css';
import { getPostSlugs } from '@/actions/blog';

export async function generateStaticParams() {
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

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const postData = await api.post.getPostContentBySlug({
    slug: (await params).slug,
  });
  if (!postData) {
    return <>Not Found</>;
  }

  return (
    <main className="w-full lg:max-w-5xl px-4 mx-auto my-12 gap-y-4 flex flex-col">
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
