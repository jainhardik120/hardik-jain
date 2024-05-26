import ErrorResponse from '@/lib/ErrorResponse';
import Message from '@/models/Message';

export async function POST(request: Request) {
  try {
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
    return new Response(JSON.stringify({ message: 'Message sent successfully' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return ErrorResponse(error, 500);
  }
}
