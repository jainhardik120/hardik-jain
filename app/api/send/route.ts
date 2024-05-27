import ErrorResponse from '@/lib/ErrorResponse';
import dbConnect from '@/lib/dbConnect';
import Message from '@/models/Message';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email, subject, message } = await request.json();
    if (!email || !subject || !message) {
      return ErrorResponse('Email, subject, and message are required', 400);
    }
    const newMessage = new Message({
      email,
      subject,
      message,
    });
    await newMessage.save();
    return new Response(null, {
      status: 201
    });
  } catch (error) {
    return ErrorResponse(error, 500);
  }
}