"use server"

import model from "../geminiModel";

interface ReferenceContent {
  type: 'code' | 'article' | 'documentation';
  content: string;
  source?: string;
}

export async function generateBlogContentUsingOutline(
  outline: string,
  referenceCode: string[] = [],
  existingArticles: string[] = [],
  documentation: string[] = []
): Promise<string> {

  const references: ReferenceContent[] = [
    ...referenceCode.map(code => ({
      type: 'code' as const,
      content: code
    })),
    ...existingArticles.map(article => ({
      type: 'article' as const,
      content: article
    })),
    ...documentation.map(doc => ({
      type: 'documentation' as const,
      content: doc
    }))
  ];

  const formattedReferences = references
    .map((ref, index) => `
Reference ${index + 1} (${ref.type}):
${ref.type === 'code'}
${ref.content}
---`).join('\n\n');

  const prompt = `As an expert in writing engaging and SEO-optimized blog posts, your task is to craft a comprehensive 8000-token long article based on the provided outline and reference materials. You'll use the given references to enhance the accuracy and depth of your content.

OUTLINE:
${outline}

REFERENCE MATERIALS:
${formattedReferences}

Guidelines for content creation:

1. Content Structure:
   - Start with a captivating introduction that clearly states the problem or question
   - Ensure logical flow between sections with clear headers
   - Use the reference materials to support your explanations
   - When discussing code, incorporate relevant examples from the provided code references
   - When explaining concepts, reference and build upon the existing articles and documentation

2. Technical Accuracy:
   - Use the provided code examples to demonstrate practical implementations
   - Reference existing documentation for technical specifications and best practices
   - Cross-reference information across different sources for accuracy
   - When adapting code examples, explain any modifications or improvements

3. Writing Style:
   - Maintain a balance between technical depth and readability
   - Include practical examples and use cases
   - Reference real-world scenarios from the provided articles
   - Add actionable tips and detailed explanations
   - Incorporate relevant keywords naturally for SEO optimization

4. Integration of References:
   - Cite and explain relevant code snippets from the reference materials
   - Build upon existing explanations from the provided articles
   - Use documentation references to ensure technical accuracy
   - Combine insights from multiple references when applicable

5. SEO and Engagement:
   - Include internal and external links to reputable sources
   - Structure content for featured snippets
   - Optimize for mobile readability
   - Include meta descriptions and image alt tags
   - End with a compelling call-to-action

Please ensure the final article seamlessly integrates insights from all provided references while maintaining a cohesive narrative that follows the outlined structure.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}