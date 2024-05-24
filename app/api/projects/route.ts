import ErrorResponse from "@/lib/ErrorResponse";
import { authMiddleware } from "@/middleware/Auth";
import clientPromise from "@/lib/mongodb";

export type Project = {
  _id? : string
  name: string;
  githubLink: string;
  demoLink: string;
  category: string;
  imageUrl: string;
  content: string;
};

async function getCollection() {
  const db = (await clientPromise).db("hardik-jain")
  return db.collection<Project>("projects");
};

export async function GET(request: Request) {
  try {
    const projectsCursor = (await getCollection()).find({});
    const projection = { content: 0 };
    const projects = await projectsCursor.project(projection).toArray();
    return new Response(JSON.stringify(projects), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return ErrorResponse(error);
  }
};

export async function POST(request: Request) {
  return authMiddleware(request, async (userId) => {
    const { name, github_link, demo_link, category, content, image_url } = await request.json();
    if (!name || !github_link || !demo_link || !category || !content || !image_url) {
      return ErrorResponse("Fields missing");
    }
    const document = {
      name,
      githubLink: github_link,
      demoLink: demo_link,
      category,
      imageUrl: image_url,
      content: content
    }
    const result = await (await getCollection()).insertOne(document);
    return Response.json({ id: result.insertedId });
  })
};