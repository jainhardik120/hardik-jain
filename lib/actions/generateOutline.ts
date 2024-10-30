"use server"

import model from "../geminiModel";

export async function generateOutline(title: string, keypoints: string[]): Promise<string> {
  const prompt = `Act as an experienced SEO copywriter tasked with generating an SEO-optimized article outline based on the given title: "${title}". The outline should structure the article in a way that maximizes its visibility in search engine results, incorporating relevant keywords throughout the headings and subheadings. Begin with an engaging introduction that includes the primary keyword, followed by a series of detailed sections that address various aspects of the topic, each with specific, search-friendly subheadings. Ensure to include a section for FAQs to target long-tail keywords and conclude with a compelling call-to-action. Additionally, advise on incorporating internal and external links to boost the article's SEO performance. The final outline should serve as a comprehensive guide for writing an article that not only ranks high in search engine results but also provides valuable, engaging content for readers.

  Consider the following key points while creating the outline:
  ${keypoints.map((point, index) => `${index + 1}. ${point}`).join('\n')}

  Please provide the outline in a clear, text only format.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}