import ErrorResponse from "@/lib/ErrorResponse";
import { authMiddleware } from "@/middleware/Auth";
import dbConnect from "@/lib/dbConnect";
import SkillModel from "@/models/Skill";
import { revalidatePath } from "next/cache";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  return authMiddleware(request, async (userId) => {
    await dbConnect();
    const updateFields = await request.json();
    if (Object.keys(updateFields).length === 0) {
      return ErrorResponse("Update fields missing", 400);
    }
    const updatedSkill = await SkillModel.findOneAndUpdate(
      { _id: params.id },
      updateFields,
      { new: true }
    );
    if (!updatedSkill) {
      return ErrorResponse("Skill not found", 404);
    }
    revalidatePath("/(portfolio)",  "page")
    return new Response(JSON.stringify({ message: "Skill updated successfully", skill: updatedSkill }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  return authMiddleware(request, async (userId) => {
    await dbConnect();
    const deletedSkill = await SkillModel.findOneAndDelete({ _id: params.id });
    if (!deletedSkill) {
      return ErrorResponse("Skill not found", 404);
    }
    revalidatePath("/(portfolio)",  "page")
    return new Response(JSON.stringify({ message: "Skill deleted successfully" }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  });
}