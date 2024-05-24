import ErrorResponse from "@/lib/ErrorResponse";
import { authMiddleware } from "@/middleware/Auth";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const db = (await clientPromise).db("hardik-jain")
    const skillsCollection = db.collection("skills");
    const skills = skillsCollection.find();
    return Response.json(skills);
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
