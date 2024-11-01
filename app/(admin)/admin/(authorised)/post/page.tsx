"use client"

import { Button } from "@/components/ui/button";
import { IPost } from "@/models/Post";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DataTable } from "../../../../../components/DataTable";

const columns: ColumnDef<IPost>[] = [
  {
    id: 'title',
    header: 'Title',
    accessorKey: 'title',
  },
  {
    id: 'edit',
    header: 'Edit',
    cell: (context) => {
      const postId = context.row.original._id;
      return (
        <button onClick={() => window.location.href = `/admin/post/${postId}`}>
          Edit
        </button>
      );
    },
  },
  {
    id: 'delete',
    header: 'Delete',
    cell: (context) => {
      const postId = context.row.original._id;
      return (
        <button onClick={async () => {
          const response = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
          if (response.ok) {
            window.location.reload();
          }
        }}>
          Delete
        </button>
      );
    },
  },
];


const PostsPage: React.FC = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<IPost[]>([]);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/posts');
        const data: IPost[] = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="w-full">
      <DataTable columns={columns} data={posts} CreateButton={
        <Button onClick={async () => {
          const response = await fetch("/api/posts/new", { method: "POST" });
          if (response.ok) {
            const json = await response.json();
            const id = json.id;
            router.push(`/admin/post/${id}`);
          }
        }}>
          New Post
        </Button>
      } filterOn='title' name='Posts' />
    </div>
  );
}

export default PostsPage;