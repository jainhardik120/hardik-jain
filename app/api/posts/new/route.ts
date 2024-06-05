import ErrorResponse from "@/lib/ErrorResponse";
import dbConnect from "@/lib/dbConnect";
import { authMiddleware } from "@/middleware/Auth";
import Post from "@/models/Post";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  return authMiddleware(request, async (userId) => {
    await dbConnect();
    let title, content, description
    if (request.bodyUsed) {
      title = (await request.json())["title"];
      content = (await request.json())["content"];
      description = (await request.json())["description"];
    }
    if (!title) {
      title = ""
    }
    if (!content) {
      content = JSON.stringify({
        type: "doc",
        content: [

        ],
      });
    }
    if (!description) {
      description = ""
    }
    const newPost = new Post({
      title,
      content, description, author: userId
    });
    const savedPost = await newPost.save();
    revalidatePath("/(portfolio)",  "page")
    return new Response(JSON.stringify({ id: savedPost._id }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    })
  });
}