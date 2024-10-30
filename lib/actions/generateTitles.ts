"use server"

import model from "../geminiModel"

export type Topic = {
  title: string,
  keywordResearch: {
    searchVolume: string,
    competitionLevel: string
  },
  outline: {
    subheadings: string[],
    keyPoints: string[]
  }
}

export default async function generateTitles(topic: string): Promise<Topic[]> {
  const prompt = `Act as a brainstorming expert with a deep understanding of SEO and content marketing. Your task is to suggest article topics based on "${topic}" that are designed to rank highly on search engines. Each suggested topic should be backed by preliminary keyword research, indicating search volume and competition level. Ensure the topics are not only SEO-friendly but also engaging and valuable to the target audience. Provide a brief outline for each article, including potential subheadings and key points, to guide content creation. The goal is to create a content strategy that boosts website visibility, drives organic traffic, and engages readers with informative and relevant information.

  Please return your response in the following JSON format:
  {
    "topics": [
      {
        "title": "Article Title",
        "keywordResearch": {
          "searchVolume": "estimated monthly search volume",
          "competitionLevel": "low/medium/high"
        },
        "outline": {
          "subheadings": ["Subheading 1", "Subheading 2", "Subheading 3"],
          "keyPoints": ["Key point 1", "Key point 2", "Key point 3"]
        }
      }
    ]
  }

  Provide at least 10 topic suggestions in this format.`;

  const result = await model.generateContent(prompt);

  // Extract the valid JSON part
  const resultText = result.response.text();
  const jsonStart = resultText.indexOf('{');
  const jsonEnd = resultText.lastIndexOf('}');

  // Return the valid JSON string
  if (jsonStart !== -1 && jsonEnd !== -1) {
    const jsonString = resultText.substring(jsonStart, jsonEnd + 1);
    return JSON.parse(jsonString).topics;
  }

  throw new Error("Invalid response format");
}