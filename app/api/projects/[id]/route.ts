import ErrorResponse from "@/lib/ErrorResponse";
import { authMiddleware } from "@/middleware/Auth";
import { ObjectId } from "mongodb";
import dbConnect from "@/lib/dbConnect";
import ProjectModel from "@/models/Project";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  return authMiddleware(request, async (userId) => {
    await dbConnect();
    const id = new ObjectId(params.id);
    const updateFields = await request.json();
    if (Object.keys(updateFields).length === 0) {
      return ErrorResponse("Update fields missing", 400);
    }
    const updatedProject = await ProjectModel.findOneAndUpdate(
      { _id: id },
      updateFields,
      { new: true }
    );
    if (!updatedProject) {
      return ErrorResponse("Project not found", 404);
    }
    return new Response(JSON.stringify({ message: "Project updated successfully" }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  });
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const id = new ObjectId(params.id);
    const project = await ProjectModel.findById(id);
    if (!project) {
      return ErrorResponse("Project not found", 404);
    }
    return new Response(JSON.stringify(project), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return ErrorResponse(error, 500);
  }
}