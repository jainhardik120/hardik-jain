import ErrorResponse from "@/lib/ErrorResponse";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";

export async function GET(request: Request) {
  try {
    await dbConnect();
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