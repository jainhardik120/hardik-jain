"use client"

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { SetStateAction, useState } from "react";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

const insertToTextArea = (intsertString: string) => {
  const textarea = document.querySelector('textarea');
  if (!textarea) {
    return null;
  }

  let sentence = textarea.value;
  const len = sentence.length;
  const pos = textarea.selectionStart;
  const end = textarea.selectionEnd;

  const front = sentence.slice(0, pos);
  const back = sentence.slice(pos, len);

  sentence = front + intsertString + back;

  textarea.value = sentence;
  textarea.selectionEnd = end + intsertString.length;

  return sentence;
};

const onImagePasted = async (dataTransfer: DataTransfer, setValue: (value: SetStateAction<string | undefined>) => void) => {
  const files: File[] = [];
  const currentDatetime = new Date().toISOString().replace(/[-:.]/g, ''); // Get current datetime without separators
  for (let index = 0; index < dataTransfer.items.length; index += 1) {
    const file = dataTransfer.files.item(index);
    if (file) {
      files.push(file);
    }
  }
  await Promise.all(
    files.map(async (file) => {
      const filenameWithDatetime = `${currentDatetime}_${file.name}`;
      const response = await fetch('/api/blog/files/signed-url', {
        method: 'POST',
        body: JSON.stringify({ filename: filenameWithDatetime, filetype: file.type }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      const signedUrl = data.signedUrl;
      const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        body: file
      });
      if (!uploadResponse.ok) {
        console.log(uploadResponse.body);
        console.log("Error Occured");
      } else {
        const publicUrl = stripQueryParameters(signedUrl);
        const insertedMarkdown = insertToTextArea(`![](${publicUrl})`);
        if (!insertedMarkdown) {
          return;
        }
        setValue(insertedMarkdown);
      }
    }),
  );
}

const stripQueryParameters = (url: string): string => {
  const parsedUrl = new URL(url);
  parsedUrl.search = '';
  return parsedUrl.toString();
}


const Page: React.FC = () => {
  const [value, setValue] = useState<string | undefined>("");
  const [title, setTitle] = useState<string>("");
  return (
    <>
      <div>
        <label htmlFor="title">Post Title</label>
        <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        <MDEditor
          height={600}
          value={value}
          onChange={setValue}
          onPaste={async (event) => {
            await onImagePasted(event.clipboardData, setValue);
          }}
          onDrop={async (event) => {
            await onImagePasted(event.dataTransfer, setValue);
          }}
        />
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