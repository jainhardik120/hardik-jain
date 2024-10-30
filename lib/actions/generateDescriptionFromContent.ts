"use server"

import model from "../geminiModel";

export async function generateDescription(
  title: string,
  content: string,
  maxLength: number = 160
): Promise<string> {

  const prompt = `As an SEO expert, generate a compelling and concise meta description for a blog post. The description should be under ${maxLength} characters, capture the essence of the content, include relevant keywords naturally, and entice readers to click through.

Title: "${title}"

Content: """
${content}
"""

Requirements for the description:
1. Must be under ${maxLength} characters
2. Should include primary keywords naturally
3. Must be written in active voice
4. Should have a clear value proposition
5. Must avoid clickbait or misleading content
6. Should be grammatically perfect
7. Must end with a complete sentence

Generate only the description without any explanations or additional text. The response should be ready to use as a meta description.`;

  try {
    const result = await model.generateContent(prompt);
    const description = result.response.text().trim();

    if (description.length > maxLength) {
      const truncated = truncateToLastSentence(description, maxLength);
      return truncated;
    }

    return description;
  } catch (error) {
    console.error('Error generating description:', error);
    throw new Error('Failed to generate description');
  }
}

function truncateToLastSentence(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;

  // Find the last sentence boundary before maxLength
  const truncated = text.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastExclamation = truncated.lastIndexOf('!');
  const lastQuestion = truncated.lastIndexOf('?');

  // Find the latest sentence ending
  const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion);

  if (lastSentenceEnd === -1) {
    // If no sentence boundary found, truncate at last space before maxLength
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace === -1 ? truncated : truncated.substring(0, lastSpace);
  }

  return text.substring(0, lastSentenceEnd + 1);
}