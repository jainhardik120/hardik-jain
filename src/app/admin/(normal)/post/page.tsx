import { DataTable } from '@/components/DataTable';
import CreatePostButton from './CreatePostButton';
import { api } from '@/server/api/server';
import { columns } from './TableColumns';

const PostsPage = async () => {
  const posts = await api.post.getAllPosts({});

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={posts ?? []}
        CreateButton={<CreatePostButton />}
        filterOn="title"
        name="Posts"
      />
    </div>
  );
};

export default PostsPage;
