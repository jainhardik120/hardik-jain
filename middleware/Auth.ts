import { parse } from 'cookie';
import SessionModel from '@/models/Session';
import ErrorResponse from '@/lib/ErrorResponse';
import dbConnect from '@/lib/dbConnect';

export const authMiddleware = async (req: Request, next: (userId: string) => Promise<Response>) => {
  const cookie = req.headers.get("cookie");
  if (!cookie) {
    return ErrorResponse('Unauthorized');
  }
  const cookies = parse(cookie);
  const sessionId = cookies.session_id;
  if (!sessionId) {
    return ErrorResponse('Unauthorized');
  }
  await dbConnect();
  try {
    const session = await SessionModel.findOne({ _id: sessionId });
    if (!session) {
      return ErrorResponse('Unauthorized');
    }
    return await next(session.userId);
  } catch (error) {
    return ErrorResponse(error);
  }
};
