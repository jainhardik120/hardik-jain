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
      <div className="max-w-5xl px-4 lg:px-20 mx-auto">
        <h1 className="text-4xl mb-4">{postData.title}</h1>
        <h4>{postData.description}</h4>
        <div className="flex my-4 flex-col sm:flex-row justify-between">
          <span>
            By <span className="font-bold">{postData.author.name}</span>
          </span>
          <span>
            {new Date(postData.createdAt).toDateString()}
          </span>
        </div>
        <hr className="mb-4" />
        {postData.content && (
          <div className="post-content" dangerouslySetInnerHTML={{ __html: postData.content }} />
        )}
      </div>
    </>
  )
}