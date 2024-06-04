"use server";

import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";

interface IBlogPost {
  id: string,
  title?: string,
  description?: string,
  createdAt: Date,
  authorName: string,
  authorPic?: string,
  authorId: string
}

export const getAllPosts = async (offset: number = 0, limit: number = 10) => {
  await dbConnect();
  const posts: IBlogPost[] = (await Post.find({})
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .select('author createdAt title description')
    .populate('author', 'name profilePic')).map((rawPost, index) => {
      return {
        id: rawPost._id.toString(),
        title: rawPost.title,
        description: rawPost.description,
        createdAt: rawPost.createdAt,
        authorName: rawPost.author.name,
        authorPic: rawPost.author.profilePic,
        authorId : rawPost.author._id.toString()
      }
    });
  return posts;
};