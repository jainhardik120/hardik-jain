import { getAllPosts } from "@/app/actions/getAllPosts";
import { IPost } from "@/models/Post";
import Link from "next/link";

export default async function Page() {
  const posts: IPost[] | null = await getAllPosts();
  return (
    <>
      <ul>
        {posts && posts.map((post, index) => {
          return (
            <>
              <li key={index}>
                <Link href={`/blog/${post._id}`}>
                  {post.title}
                </Link>
              </li>
            </>
          )
        })}
      </ul>
    </>
  )
}