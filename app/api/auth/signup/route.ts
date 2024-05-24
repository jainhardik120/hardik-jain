import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
import { ObjectId } from 'mongodb';
import ErrorResponse from '@/lib/ErrorResponse';

export async function POST(request : Request) {
  try {
    throw new Error("Signup not allowed")
    const mongo = (await clientPromise).db("hardik-jain");
    const users = mongo.collection("users");
    const sessions = mongo.collection("sessions");
    const { email, password } = await request.json();

    if (!email || !password) {
      return ErrorResponse('Email and password are required', 400);
    }


    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return ErrorResponse('Email already in use', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      _id: new ObjectId(),
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    await users.insertOne(newUser);

    const sessionId = new ObjectId();
    const session = {
      _id: sessionId,
      userId: newUser._id,
      createdAt: new Date(),
    };
    await sessions.insertOne(session);

    const cookie = serialize('session_id', sessionId.toString(), {
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
    return ErrorResponse('Internal server error', 500);
  }
}
