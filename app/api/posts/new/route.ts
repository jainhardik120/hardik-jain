import ErrorResponse from "@/lib/ErrorResponse";
import dbConnect from "@/lib/dbConnect";
import { authMiddleware } from "@/middleware/Auth";
import Post from "@/models/Post";

export async function POST(request: Request) {
  return authMiddleware(request, async (userId) => {
    await dbConnect();
    let title, content
    if (request.bodyUsed) {
      title = (await request.json())["title"];
      content = (await request.json())["content"];
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
    const newPost = new Post({
      title,
      content,
    });
    const savedPost = await newPost.save();
    return new Response(JSON.stringify({ id: savedPost._id }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    })
  });
}