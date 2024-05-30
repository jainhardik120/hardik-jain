import dbConnect from '@/lib/dbConnect';
import ErrorResponse from '@/lib/ErrorResponse';
import { authMiddleware } from '@/middleware/Auth';
import Session from '@/models/Session';
import { serialize } from 'cookie';

export async function GET(request: Request) {
  return authMiddleware(request, async (userId) => {
    await dbConnect();
    const session_id = request.headers.get('cookie')?.split('; ').find(cookie => cookie.startsWith('session_id='))?.split('=')[1];
    if (!session_id) {
      return ErrorResponse('No session found.', 400);
    }
    const session = await Session.findById(session_id);
    if (!session) {
      return ErrorResponse('Invalid session.', 401);
    }
    await Session.deleteOne({ _id: session_id });
    const cookie = serialize('session_id', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: -1,
      path: '/',
    });
    return Response.json(null, {status : 201})
  });
}
