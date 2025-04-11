import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';

import { titlesSchema } from './schema';

export async function POST(req: Request) {
  const { prompt } = (await req.json()) as { prompt: string };

  const result = await generateObject({
    model: google('gemini-2.5-pro-exp-03-25'),
    output: 'array',
    schema: titlesSchema,
    experimental_repairText: async (input: { text: string }) => {
      const jsonStart = input.text.indexOf('{');
      const jsonEnd = input.text.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonString = input.text.substring(jsonStart, jsonEnd + 1);
        return jsonString;
      }
      return null;
    },
    prompt: `Act as a brainstorming expert with a deep understanding of 
              SEO and content marketing. Your task is to suggest article topics based on 
              '${prompt}' that are designed to rank highly on search engines. Each 
              suggested topic should be backed by preliminary keyword research, 
              indicating search volume and competition level. Ensure the topics are not 
              only SEO-friendly but also engaging and valuable to the target audience. 
              Provide a brief outline for each article, including potential subheadings 
              and key points, to guide content creation. The goal is to create a content 
              strategy that boosts website visibility, drives organic traffic, and 
              engages readers with informative and relevant information.     
              Provide at least 10 topic suggestions in the required format. Don't 
              add any \`\`\` to the response. 
              or any ny tag or anything, start the response with the proper json format only`,
  });

  return result.toJsonResponse();
}
