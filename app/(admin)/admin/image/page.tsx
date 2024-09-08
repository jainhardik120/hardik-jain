import Editor from "./editor";

export default function Page() {
  if (typeof window === "undefined") return (
    <h4>
      Not available server side
    </h4>
  );
  return (
    <Editor />
  )
}