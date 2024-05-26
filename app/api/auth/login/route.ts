import ErrorResponse from "@/lib/ErrorResponse";
import dbConnect from "@/lib/dbConnect";
import Session from "@/models/Session";
import User from "@/models/User";
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    if (!email || !password) {
      return ErrorResponse('Email and password are required', 400);
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return ErrorResponse('Invalid email or password', 401);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return ErrorResponse('Invalid email or password', 401);
    }

    const session = new Session({
      userId: user._id,
    });
    const savedSession = await session.save();
    const cookie = serialize('session_id', savedSession._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return new Response(JSON.stringify({ message: 'Login successful' }), {
      status: 200,
      headers: {
        'Set-Cookie': cookie,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
    return ErrorResponse(error);
  }
}