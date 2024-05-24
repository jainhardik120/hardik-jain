import { parse } from 'cookie';
import clientPromise from '../lib/mongodb';
import { ObjectId } from 'mongodb';
import ErrorResponse from '@/lib/ErrorResponse';

export const authMiddleware = async (req: Request, next: (userId: string) => Promise<Response>) => {
  // const cookie = req.headers.get("cookie");
  // if (!cookie) {
  //   return ErrorResponse('Unauthorized');
  // }
  // const cookies = parse(cookie);
  // const sessionId = cookies.session_id;
  // if (!sessionId) {
  //   return ErrorResponse('Unauthorized');
  // }
  try {
    // const client = await clientPromise;
    // const db = client.db('hardik-jain');
    // const sessions = db.collection('sessions');
    // const session = await sessions.findOne({ _id: new ObjectId(sessionId) });
    // if (!session) {
    //   return ErrorResponse('Unauthorized');
    // }
    // return (await next(session.userId));
    return (await next("session.userId"));
  } catch (error) {
    console.log("from auth middleware", error);
    return ErrorResponse(error);
  }
};
