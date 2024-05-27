"use client"

import { useState } from "react";
import { JSONContent } from "novel";
import { defaultValue } from "./default-value";
import Editor from "@/components/editor/advanced-editor";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";

const Page: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [value, setValue] = useState<JSONContent>(defaultValue);
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
          <Editor initialValue={value} onChange={setValue} />
        </div>
        <Button type="submit" onClick={async () => {
          if (!value || value.length === 0 || title.length == 0) {
            return;
          }
          const response = await fetch("/api/blog/posts", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: title,
              content: value
            }),
          })
        }}>
          Create Post
        </Button>
      </div>
    </>
  )
}


export default Page;