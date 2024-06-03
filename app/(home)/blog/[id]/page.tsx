import { getPostContent } from "@/app/actions/getPostContent";
import "./postcontent.css"
import { getPostIds } from "@/app/actions/getPostIds";

interface PostId {
  id: string
}

export async function generateStaticParams() {
  const postIds: PostId[] = await getPostIds();
  console.log(postIds);
  return postIds;
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
      <div className="post-content" dangerouslySetInnerHTML={{ __html: postData }} />
    </>
  )
}