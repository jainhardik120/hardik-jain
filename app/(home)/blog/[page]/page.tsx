import { getAllPosts } from "@/lib/actions/getAllPosts";
import Link from "next/link";

export default async function Page({ params }: { params: { page: number } }) {
  const posts = await getAllPosts((params.page - 1) * 10);
  return (
    <>
      <div className="flex flex-col gap-4">
        {posts && posts.map((post, index) => {
          return (
            <>
              <div key={index} className="px-4 py-2 border border-border rounded-sm overflow-x-hidden">
                <Link href={`/post/${post.id}`} prefetch={false}>
                  <h1 className="text text-2xl cursor-pointer">
                    {post.title}
                  </h1>
                  <p>
                    {post.description}
                  </p>
                </Link>
                <p>
                  {post.authorName}
                </p>
              </div>
            </>
          )
        })}
      </div>
    </>
  )
}