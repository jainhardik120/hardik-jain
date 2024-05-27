"use client"

import { useEffect, useState } from "react";
import { JSONContent } from "novel";
import Editor from "@/components/editor/advanced-editor";
import { Input } from "@/components/ui/input"
import { defaultValue } from "./default-value";
import { IPost } from "@/models/Post";

export default function Page({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<IPost | null>(null);
  useEffect(() => {
    const getDocument = async () => {
      const response = await fetch(`/api/posts/${params.id}`, { method: "GET" });
      const json: IPost = await response.json();
      setPost(json);
      setLoading(false);
    }
    getDocument();
  }, [params.id]);

  if (loading || (!post)) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className="flex flex-row justify-center w-full">
        <Editor initialValue={post.content ? JSON.parse(post.content) : defaultValue} initialDescription={post.description || ""} initialTitle={post.title || ""} onChange={
          async (content: JSONContent, title, description) => {
            await fetch(`/api/posts/${params.id}`, {
              method: "PUT",
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                title: title,
                content: JSON.stringify(content),
                description: description
              }),
            })
          }
        } />
      </div>
    </>
  )
}