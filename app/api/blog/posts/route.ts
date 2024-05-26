import ErrorResponse from "@/lib/ErrorResponse";
import { authMiddleware } from "@/middleware/Auth";
import Post from "@/models/Post";


export async function POST(request: Request) {
  return authMiddleware(request, async (userId) => {
    try {
      const { title, content } = await request.json();
      if (!title || !content) {
        return ErrorResponse("Title and body are required", 400);
      }

      const newPost = new Post({
        title,
        content,
      });

      const savedPost = await newPost.save();

      return new Response(JSON.stringify({ id: savedPost._id }), {
        status: 201,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      return ErrorResponse(error, 500);
    }
  });
}

export async function GET(request: Request) {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .lean()

    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return ErrorResponse(error, 500);
  }
}
