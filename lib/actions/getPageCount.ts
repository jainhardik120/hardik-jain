"use server"

import dbConnect from "@/lib/dbConnect"
import Post from "@/models/Post";

export const getPageCount = async () => {
  await dbConnect();
  const count = await Post.countDocuments();
  return Math.ceil(count/10);
}