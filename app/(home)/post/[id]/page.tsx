import { getPostContent, getPostMetadata } from "@/lib/actions/getPostContent";
import "./postcontent.css"
import { Metadata } from "next";


import 'highlight.js/styles/atom-one-dark.css';

// import { getPostIds } from "@/lib/actions/getPostIds";

// interface PostId {
//   id: string
// }

// export async function generateStaticParams() {
//   const postIds: PostId[] = await getPostIds();
//   return postIds;
// }

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  return (await getPostMetadata(params.id)) || {
    title: "",
    description: ""
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  const postData = await getPostContent(params.id);
  if (!postData) {
    return <>
      Not Found
    </>
  }
  return (
    <>
      <div className="post-content max-w-5xl px-4 lg:px-20 mx-auto">
        <h1>{postData.title}</h1>
        <h4>{postData.description}</h4>
        <hr />
        {postData.content && (
          <div dangerouslySetInnerHTML={{ __html: postData.content }} />
        )}
      </div>
    </>
  )
}