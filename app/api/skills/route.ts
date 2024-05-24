import ErrorResponse from "@/lib/ErrorResponse";
import { authMiddleware } from "@/middleware/Auth";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const db = (await clientPromise).db("hardik-jain")
    const skillsCollection = db.collection("skills");
    const skillsCursor = skillsCollection.find({});
    const skills = await skillsCursor.toArray();
    return new Response(JSON.stringify(skills), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return ErrorResponse(error);
  }
}


export async function POST(request: Request) {
  return authMiddleware(request, async (userId) => {
    const db = (await clientPromise).db("hardik-jain")
    const skillsCollection = db.collection("skills");
    const { name, skills } = await request.json();
    const newDocument = {
      name,
      skills
    }
    const result = await skillsCollection.insertOne(newDocument);
    return Response.json({ id: result.insertedId });
  })
} 
