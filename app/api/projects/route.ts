import dbConnect from "@/lib/dbConnect";
import Project from "@/models/Project";
import ErrorResponse from "@/lib/ErrorResponse";
import { authMiddleware } from "@/middleware/Auth";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const projects = await Project.find({}, { content: 0 }).exec();
    return new Response(JSON.stringify(projects), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return ErrorResponse(error, 500);
  }
}

export async function POST(request: Request) {
  return authMiddleware(request, async (userId) => {
    try {
      await dbConnect();
      const { name, github_link, demo_link, category, content, image_url } = await request.json();

      if (!name || !github_link || !demo_link || !category || !content || !image_url) {
        return ErrorResponse("Fields missing", 400);
      }

      const newProject = new Project({
        name,
        githubLink: github_link,
        demoLink: demo_link,
        category,
        imageUrl: image_url,
        content,
      });

      const savedProject = await newProject.save();
      return new Response(JSON.stringify({ id: savedProject._id }), {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      return ErrorResponse(error, 500);
    }
  });
}
