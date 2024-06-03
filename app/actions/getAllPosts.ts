"use server";

import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";

export const getAllPosts = async () => {
  await dbConnect();
  const posts = await Post.find({});
  return posts;
};