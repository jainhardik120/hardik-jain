import { GoogleGenerativeAI } from '@google/generative-ai';

import { env } from '@/env';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro-preview-03-25' });

export default model;
