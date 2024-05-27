import ErrorResponse from "@/lib/ErrorResponse";
import dbConnect from "@/lib/dbConnect";
import { authMiddleware } from "@/middleware/Auth";
import Post from "@/models/Post";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  return authMiddleware(request, async (userId) => {
    await dbConnect();
    const updateFields = await request.json();
    const updatedPost = await Post.findByIdAndUpdate({ _id: params.id }, updateFields,
      { new: true });
    if (!updatedPost) {
      return ErrorResponse("Post not found", 404);
    }
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    await sleep(2000)
    return new Response(null, { status: 201 })
  });
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const post = await Post.findById(params.id);
    return new Response(JSON.stringify(post), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return ErrorResponse(error, 500);
  }
}