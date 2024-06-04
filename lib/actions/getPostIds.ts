"use server"

import dbConnect from "@/lib/dbConnect"
import Post from "@/models/Post"
import { ObjectId } from "mongoose";

export const getPostIds = async () => {
  await dbConnect();
  const posts : {_id : ObjectId}[] = await Post.find({}, '_id').lean();
  if (!posts) {
    return []
  }
  const postIds = posts.map(post => ({ id: post._id.toString()}));
  return postIds;
}