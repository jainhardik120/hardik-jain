import { authMiddleware } from "@/middleware/Auth";

export async function GET(request: Request) {
  return authMiddleware(request, async (userId) => {
    return Response.json({
      status : true,
      userId
    })
  })
}