import ErrorResponse from "@/lib/ErrorResponse";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
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
    return Response.json({id : result.insertedId});
  } catch (error: any) {
    return ErrorResponse(error);
  }
} 
