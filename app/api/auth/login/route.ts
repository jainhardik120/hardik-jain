import ErrorResponse from "@/lib/ErrorResponse";
import clientPromise from "@/lib/mongodb";
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const mongo = (await clientPromise).db("hardik-jain");
    const users = mongo.collection("users");
    const sessions = mongo.collection("sessions");
    const { email, password } = await request.json();
    if (!email || !password) {
      return ErrorResponse('Email and password are required');
    }
    const user = await users.findOne({ email });
    if (!user) {
      return ErrorResponse('Invalid email or password');
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return ErrorResponse('Invalid email or password');
    }


    const sessionId = new ObjectId();
    const session = {
      _id: sessionId,
      userId: user._id,
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
    return new Response(JSON.stringify({ message: 'Login successful' }), {
      status: 200,
      headers: {
        'Set-Cookie': cookie,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return ErrorResponse(error)
  }
}