import ErrorResponse from "@/lib/ErrorResponse";
import clientPromise from "@/lib/mongodb";
import { authMiddleware } from "@/middleware/Auth";
import { unstable_noStore } from "next/cache";

export async function POST(request: Request) {
  return authMiddleware(request, async (userId) => {
    const body = await request.json();
    const mongo = (await clientPromise).db("hardik-jain");
    const post = mongo.collection("posts");
    const { title, content } = body;
    if (!title || !content) {
      return ErrorResponse("Title and body are required")
    }
    const result = await post.insertOne(
      {
        title: title,
        content: content
      }
    )
    return Response.json({ id: result.insertedId });
  })
}

export async function GET(request: Request) {
  unstable_noStore();
  try {
    const mongo = (await clientPromise).db("hardik-jain");
    const posts = mongo.collection("posts");

    const result = await posts.find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .toArray();

    console.log(result);
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return ErrorResponse(error);
  }
}
