"use client"

import Link from "next/link";

const PostsPage: React.FC = () => {
  return (
    <>
      Posts Page
      <Link href="/admin/post/new">New Post</Link>
    </>
  )
}

export default PostsPage;