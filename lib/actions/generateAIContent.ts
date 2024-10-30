"use server"

import model from "../geminiModel";

interface ContentContext {
  beforeText: string;
  afterText: string;
  position: {
    from: number;
    to: number;
  };
}

export default async function generateAIContent(
  query: string,
  context: ContentContext
): Promise<string> {
  const prompt = `As an expert content writer, your task is to generate content that seamlessly fits within an existing article. You'll be writing specifically about "${query}" in a way that naturally connects with the surrounding content.

CONTEXT:
Text before your content:
---
${context.beforeText.slice(-1000)}
---

Text after your content:
---
${context.afterText.slice(0, 1000)}
---

Guidelines for content generation:

1. Content Integration:
   - Ensure smooth transition from the preceding content
   - Maintain consistent tone and style with the existing text
   - Use appropriate connecting phrases to link with surrounding content
   - Match the technical depth and complexity of the existing content

2. Contextual Awareness:
   - Reference relevant concepts from the preceding text when applicable
   - Anticipate and prepare for topics covered in the following text
   - Maintain the logical flow of the overall article
   - Avoid repeating information already covered

3. Writing Style:
   - Match the existing content's formality level
   - Maintain consistent terminology
   - Use similar heading structure if needed
   - Keep the same level of technical detail

4. Scope:
   - Focus specifically on the requested topic: "${query}"
   - Generate content that fits naturally at this specific position
   - Ensure the length is proportional to the surrounding content
   - Create a natural bridge between the preceding and following sections

Please generate content that reads as if it was originally written as part of the article, focusing specifically on "${query}" while maintaining seamless integration with the surrounding text.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}