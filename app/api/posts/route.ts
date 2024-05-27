import ErrorResponse from "@/lib/ErrorResponse";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const posts = await Post.find({}, { content: 0 }).exec();
    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return ErrorResponse(error, 500);
  }
}