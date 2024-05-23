"use client"

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useState } from "react";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

const Page: React.FC = () => {
  const [value, setValue] = useState("**Hello world!!!**");
  return (
    <>
      <div>
        Create Post Page
        <MDEditor height={600} value={value} onChange={(value) => setValue(value || "")} />
      </div>
    </>
  )
}
export default Page;