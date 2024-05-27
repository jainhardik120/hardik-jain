"use client"

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const PostsPage: React.FC = () => {
  const router = useRouter();
  return (
    <>
      Posts Page
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
    </>
  )
}

export default PostsPage;