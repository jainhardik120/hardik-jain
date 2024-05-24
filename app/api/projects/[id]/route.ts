import ErrorResponse from "@/lib/ErrorResponse";
import { authMiddleware } from "@/middleware/Auth";
import clientPromise from "@/lib/mongodb";
import { Project } from "../route";
import { ObjectId } from "mongodb";

async function getCollection() {
  const db = (await clientPromise).db("hardik-jain")
  return db.collection("projects");
};

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  return authMiddleware(request, async (userId) => {
    const projectsCollection = await getCollection();
    const id = new ObjectId(params.id);
    const { ...updateFields } = await request.json();
    if (Object.keys(updateFields).length === 0) {
      return ErrorResponse("Update fields missing");
    }
    const result = await projectsCollection.updateOne(
      { "_id": id },
      { $set: updateFields }
    );
    if (result.matchedCount === 0) {
      return ErrorResponse("Project not found");
    }
    return new Response(JSON.stringify({ message: "Project updated successfully" }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  });
};

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = new ObjectId(params.id);
    const project = await (await getCollection()).findOne({ "_id": id });
    console.log(project);
    return new Response(JSON.stringify(project), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return ErrorResponse(error);
  }
};
