"use client"

import { useEffect, useState } from "react";
import { JSONContent } from "novel";
import Editor from "@/components/editor/advanced-editor";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { defaultValue } from "./default-value";
import { IPost } from "@/models/Post";

export default function Page({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState<string>("");
  const [value, setValue] = useState<JSONContent>(defaultValue);
  useEffect(() => {
    const getDocument = async () => {
      const response = await fetch(`/api/posts/${params.id}`, { method: "GET" });
      const json: IPost = await response.json();
      if (json.title) {
        setTitle(json.title);
      }
      if (json.content) {
        setValue(JSON.parse(json.content));
      }
      setLoading(false);
    }
    getDocument();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div>
        <Input
          name="title"
          type="text"
          value={title}
          placeholder=""
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="w-full">
          <Editor initialValue={value} onChange={
            async (content: JSONContent) => {
              await fetch(`/api/posts/${params.id}`, {
                method: "PUT",
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  title: title,
                  content: JSON.stringify(content)
                }),
              })
            }
          } />
        </div>
      </div>
    </>
  )
}