"use client"

import { useState } from "react";
import TextInput from "@/app/components/TextInput";
import { JSONContent } from "novel";
import { defaultValue } from "./default-value";
import Editor from "@/components/editor/advanced-editor";


const Page: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [value, setValue] = useState<JSONContent>(defaultValue);
  return (
    <>
      <div>
        <TextInput
          label="Title"
          name="title"
          type="text"
          value={title}
          placeholder=""
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="h-[500px] w-full">
          <Editor initialValue={value} onChange={setValue} />

        </div>
        <button type="button" onClick={async () => {
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
        }}>Create Post</button>
      </div>
    </>
  )
}


export default Page;