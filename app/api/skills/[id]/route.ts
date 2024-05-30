import ErrorResponse from "@/lib/ErrorResponse";
import { authMiddleware } from "@/middleware/Auth";
import { ObjectId } from "mongodb";
import dbConnect from "@/lib/dbConnect";
import SkillModel from "@/models/Skill";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  return authMiddleware(request, async (userId) => {
    await dbConnect();
    const id = new ObjectId(params.id);
    const updateFields = await request.json();
    if (Object.keys(updateFields).length === 0) {
      return ErrorResponse("Update fields missing", 400);
    }
    const updatedSkill = await SkillModel.findOneAndUpdate(
      { _id: id },
      updateFields,
      { new: true }
    );
    if (!updatedSkill) {
      return ErrorResponse("Skill not found", 404);
    }
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
    const id = new ObjectId(params.id);
    const deletedSkill = await SkillModel.findOneAndDelete({ _id: id });
    if (!deletedSkill) {
      return ErrorResponse("Skill not found", 404);
    }
    return new Response(JSON.stringify({ message: "Skill deleted successfully" }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  });
}