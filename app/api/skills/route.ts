import ErrorResponse from "@/lib/ErrorResponse";
import { authMiddleware } from "@/middleware/Auth";
import dbConnect from "@/lib/dbConnect";
import Skill from "@/models/Skill";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const skills = await Skill.find({});
    return new Response(JSON.stringify(skills), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return ErrorResponse(error, 500);
  }
}

export async function POST(request: Request) {
  return authMiddleware(request, async (userId) => {
    await dbConnect();
    const { name, skills } = await request.json();
    if (!name || !skills) {
      return ErrorResponse("Name and skills are required", 400);
    }
    const newSkill = new Skill({
      name,
      skills
    });
    const savedSkill = await newSkill.save();
    return new Response(JSON.stringify({ id: savedSkill._id }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  });
}
