import { api } from '@/server/api/server';
import { PostEditor } from './PostEditor';

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const initData = await api.post.getPostById({ id: (await params).id });
  if (!initData) {
    return <div>Not Found</div>;
  }

  return <PostEditor initData={initData} />;
}
