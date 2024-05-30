import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Session from '@/models/Session';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
import ErrorResponse from '@/lib/ErrorResponse';

export async function POST(request: Request) {
  try {
    await dbConnect();
    return ErrorResponse("Not Allowed", 401)
    const { email, password } = await request.json();

    if (!email || !password) {
      return ErrorResponse('Email and password are required', 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ErrorResponse('Email already in use', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    await newUser.save();

    const session = new Session({
      userId: newUser._id,
      createdAt: new Date(),
    });

    await session.save();

    const cookie = serialize('session_id', session._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return new Response(JSON.stringify({ message: 'Signup successful' }), {
      status: 201,
      headers: {
        'Set-Cookie': cookie,
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error(error);
    return ErrorResponse(error, 500);
  }
}
