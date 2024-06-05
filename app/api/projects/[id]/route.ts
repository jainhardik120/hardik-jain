import ErrorResponse from "@/lib/ErrorResponse";
import { authMiddleware } from "@/middleware/Auth";
import dbConnect from "@/lib/dbConnect";
import ProjectModel from "@/models/Project";
import { revalidatePath } from "next/cache";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  return authMiddleware(request, async (userId) => {
    await dbConnect();
    const updateFields = await request.json();
    if (Object.keys(updateFields).length === 0) {
      return ErrorResponse("Update fields missing", 400);
    }
    const updatedProject = await ProjectModel.findOneAndUpdate(
      { _id: params.id },
      updateFields,
      { new: true }
    );
    if (!updatedProject) {
      return ErrorResponse("Project not found", 404);
    }
    revalidatePath("/(portfolio)",  "page")
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
    const project = await ProjectModel.findById(params.id);
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