/* eslint-disable import/max-dependencies */

import { revalidatePath } from 'next/cache';

import { Blockquote } from '@tiptap/extension-blockquote';
import { Bold } from '@tiptap/extension-bold';
import { BubbleMenu } from '@tiptap/extension-bubble-menu';
import { BulletList } from '@tiptap/extension-bullet-list';
import { CharacterCount } from '@tiptap/extension-character-count';
import { Code } from '@tiptap/extension-code';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { Color } from '@tiptap/extension-color';
import { Document } from '@tiptap/extension-document';
import { Dropcursor } from '@tiptap/extension-dropcursor';
import { FloatingMenu } from '@tiptap/extension-floating-menu';
import { Gapcursor } from '@tiptap/extension-gapcursor';
import { HardBreak } from '@tiptap/extension-hard-break';
import { Heading } from '@tiptap/extension-heading';
import { Highlight } from '@tiptap/extension-highlight';
import { History } from '@tiptap/extension-history';
import { HorizontalRule } from '@tiptap/extension-horizontal-rule';
import { Image } from '@tiptap/extension-image';
import { Italic } from '@tiptap/extension-italic';
import { Link } from '@tiptap/extension-link';
import { ListItem } from '@tiptap/extension-list-item';
import { OrderedList } from '@tiptap/extension-ordered-list';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Strike } from '@tiptap/extension-strike';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import { Text } from '@tiptap/extension-text';
import { TextStyle } from '@tiptap/extension-text-style';
import { Underline } from '@tiptap/extension-underline';
import YouTube from '@tiptap/extension-youtube';
import { generateHTML } from '@tiptap/html';
import { TRPCError } from '@trpc/server';
import { generateSlug } from 'random-word-slugs';
import { z } from 'zod';

import model from '@/lib/geminiModel';
import {
  createTRPCRouter,
  permissionCheckProcedure,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import { PostSchema } from '@/types/schemas';

export type Topic = {
  title: string;
  keywordResearch: {
    searchVolume: string;
    competitionLevel: string;
  };
  outline: {
    subheadings: string[];
    keyPoints: string[];
  };
};

export const postRouter = createTRPCRouter({
  createNewPost: permissionCheckProcedure('post', 'create').mutation(async ({ ctx }) => {
    const post = await ctx.db.post.create({
      data: {
        authorId: ctx.session.user.id,
        title: '',
        content: JSON.stringify({
          type: 'doc',
          content: [],
        }),
        slug: generateSlug(),
      },
    });
    revalidatePath('/');
    revalidatePath(`/post/${post.slug}`);
    return post.id;
  }),
  deletePost: permissionCheckProcedure('post', 'delete')
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.post.delete({
        where: {
          id: input.id,
          ...(ctx.permission.whereInput ? { AND: ctx.permission.whereInput } : {}),
        },
      });
    }),
  getAllPosts: publicProcedure
    .input(
      z.object({
        offset: z.number().optional().default(0),
        limit: z.number().optional().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { offset, limit } = input;
      const posts = await ctx.db.post.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return posts;
    }),
  getPostMetadata: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = ctx.db.post.findUnique({
        where: { slug: input.slug },
        select: {
          title: true,
          description: true,
        },
      });

      return data;
    }),
  getRelatedPosts: publicProcedure
    .input(
      z.object({
        currentSlug: z.string(),
        tags: z.array(z.string()),
        limit: z.number().optional().default(3),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { currentSlug, tags, limit } = input;
      const postsWithTags = await ctx.db.post.findMany({
        where: {
          slug: { not: currentSlug },
          tags: { hasSome: tags },
        },
        include: {
          author: {
            select: {
              name: true,
              image: true,
              id: true,
            },
          },
        },
      });
      const sortedPosts = postsWithTags.sort((a, b) => {
        const aMatches = a.tags.filter((tag) => tags.includes(tag)).length;
        const bMatches = b.tags.filter((tag) => tags.includes(tag)).length;
        return bMatches - aMatches;
      });
      return sortedPosts.slice(0, limit);
    }),
  getPostContentBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const { slug } = input;

      const post = await ctx.db.post.findUnique({
        where: { slug },
        include: {
          author: {
            select: {
              name: true,
              image: true,
              twitter: true,
              linkedin: true,
              website: true,
              bio: true,
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      const renderedContent = generateHTML(JSON.parse(post.content), [
        Blockquote,
        Bold,
        BubbleMenu,
        BulletList,
        ListItem,
        TextStyle,
        CharacterCount,
        Code,
        CodeBlockLowlight,
        Color,
        Document,
        OrderedList,
        Dropcursor,
        FloatingMenu,
        Gapcursor,
        HardBreak,
        Heading,
        Highlight,
        History,
        HorizontalRule,
        Image,
        Italic,
        Link,
        Paragraph,
        Placeholder,
        Strike,
        TaskItem,
        TaskList,
        Text,
        Underline,
        YouTube,
      ]);

      return { ...post, content: renderedContent };
    }),
  getPostById: permissionCheckProcedure('post', 'read')
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: {
          id: input.id,
          ...(ctx.permission.whereInput ? { AND: ctx.permission.whereInput } : {}),
        },
      });
      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }
      return post;
    }),
  updatePostById: permissionCheckProcedure('post', 'update')
    .input(
      z.object({
        id: z.string(),
        post: PostSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.post.update({
        where: {
          id: input.id,
          ...(ctx.permission.whereInput ? { AND: ctx.permission.whereInput } : {}),
        },
        data: {
          ...input.post,
        },
      });
      revalidatePath('/');
      revalidatePath(`/post/${input.post.slug}`);
      return true;
    }),
  generateAIContent: protectedProcedure
    .input(
      z.object({
        query: z.string(),
        context: z.object({
          beforeText: z.string(),
          afterText: z.string(),
          position: z.object({
            from: z.number(),
            to: z.number(),
          }),
        }),
      }),
    )
    .query(async ({ input }) => {
      const prompt = `As an expert content writer, your task is to generate content 
        that seamlessly fits within an existing article. You'll be writing specifically
        about '${input.query}' in a way that naturally connects with the surrounding content.

        CONTEXT:
        Text before your content:
        ---
        ${input.context.beforeText.slice(-1000)}
        ---
        
        Text after your content:
        ---
        ${input.context.afterText.slice(0, 1000)}
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
          - Focus specifically on the requested topic: '${input.query}'
          - Generate content that fits naturally at this specific position
          - Ensure the length is proportional to the surrounding content
          - Create a natural bridge between the preceding and following sections
        
        Please generate content that reads as if it was originally written as part of 
        the article, focusing specifically on '${input.query}' while maintaining seamless 
        integration with the surrounding text.`;

      const result = await model.generateContent(prompt);

      return result.response.text();
    }),
  generateTitles: protectedProcedure
    .input(
      z.object({
        topic: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const prompt = `Act as a brainstorming expert with a deep understanding of 
        SEO and content marketing. Your task is to suggest article topics based on 
        '${input.topic}' that are designed to rank highly on search engines. Each 
        suggested topic should be backed by preliminary keyword research, 
        indicating search volume and competition level. Ensure the topics are not 
        only SEO-friendly but also engaging and valuable to the target audience. 
        Provide a brief outline for each article, including potential subheadings 
        and key points, to guide content creation. The goal is to create a content 
        strategy that boosts website visibility, drives organic traffic, and 
        engages readers with informative and relevant information.

        Please return your response in the following JSON format:
        {
          'topics': [
            {
              'title': 'Article Title',
              'keywordResearch': {
                'searchVolume': 'estimated monthly search volume',
                'competitionLevel': 'low/medium/high'
              },
              'outline': {
                'subheadings': ['Subheading 1', 'Subheading 2', 'Subheading 3'],
                'keyPoints': ['Key point 1', 'Key point 2', 'Key point 3']
              }
            }
          ]
        }

        Provide at least 10 topic suggestions in this format.`;

      const result = await model.generateContent(prompt);
      const resultText = result.response.text();
      const jsonStart = resultText.indexOf('{');
      const jsonEnd = resultText.lastIndexOf('}');

      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonString = resultText.substring(jsonStart, jsonEnd + 1);
        const parsed = JSON.parse(jsonString) as { topics?: Topic[] };
        if (parsed?.topics) {
          return parsed.topics;
        }
      }
      throw new Error('Invalid response format');
    }),
  generateOutline: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        keypoints: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const prompt = `Act as an experienced SEO copywriter tasked with 
        generating an SEO-optimized article outline based on the given 
        title: '${input.title}'. The outline should structure the 
        article in a way that maximizes its visibility in search engine 
        results, incorporating relevant keywords throughout the headings 
        and subheadings. Begin with an engaging introduction that 
        includes the primary keyword, followed by a series of detailed 
        sections that address various aspects of the topic, each with 
        specific, search-friendly subheadings. Ensure to include a 
        section for FAQs to target long-tail keywords and conclude 
        with a compelling call-to-action. Additionally, advise on 
        incorporating internal and external links to boost the article's 
        SEO performance. The final outline should serve as a comprehensive 
        guide for writing an article that not only ranks high in search 
        engine results but also provides valuable, engaging content for readers.

        Consider the following key points while creating the outline:
        ${input.keypoints}

        Please provide the outline in a clear, text-only format.`;

      const result = await model.generateContent(prompt);
      const outline = result.response.text();

      return outline;
    }),
  generateDescription: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        maxLength: z.number().default(160),
      }),
    )
    .mutation(async ({ input }) => {
      const prompt = `As an SEO expert, generate a compelling and concise 
        meta description for a blog post. The description should be under 
        ${input.maxLength} characters, capture the essence of the content, 
        include relevant keywords naturally, and entice readers to click through.

        Title: '${input.title}'

        Content: '''
        ${input.content}
        '''

        Requirements for the description:
        1. Must be under ${input.maxLength} characters
        2. Should include primary keywords naturally
        3. Must be written in active voice
        4. Should have a clear value proposition
        5. Must avoid clickbait or misleading content
        6. Should be grammatically perfect
        7. Must end with a complete sentence

        Generate only the description without any explanations or additional 
        text. The response should be ready to use as a meta description.`;

      try {
        const result = await model.generateContent(prompt);
        const description = result.response.text().trim();

        if (description.length > input.maxLength) {
          return truncateToLastSentence(description, input.maxLength);
        }

        return description;
      } catch {
        throw new Error('Failed to generate description');
      }
    }),
  generateBlogContent: protectedProcedure
    .input(
      z.object({
        outline: z.string(),
        referenceCode: z.array(z.string()).optional(),
        existingArticles: z.array(z.string()).optional(),
        documentation: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { outline, referenceCode = [], existingArticles = [], documentation = [] } = input;

      const references = [
        ...referenceCode.map((code) => ({
          type: 'code' as const,
          content: code,
        })),
        ...existingArticles.map((article) => ({
          type: 'article' as const,
          content: article,
        })),
        ...documentation.map((doc) => ({
          type: 'documentation' as const,
          content: doc,
        })),
      ];

      const formattedReferences = references
        .map(
          (ref, index) => `
              Reference ${index + 1} (${ref.type}):
              ${ref.content}
              ---
              `,
        )
        .join('\n\n');

      const prompt = `As an expert in writing engaging and SEO-optimized 
        blog posts, your task is to craft a comprehensive long article based 
        on the provided outline and reference materials. You'll use the 
        given references to enhance the accuracy and depth of your content.

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
          - When explaining concepts, reference and build upon the existing articles and 
            documentation

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

        Please ensure the final article seamlessly integrates insights from all 
        provided references while maintaining a cohesive narrative that follows 
        the outlined structure.`;

      try {
        const result = await model.generateContent(prompt);

        return result.response.text();
      } catch {
        throw new Error('Failed to generate blog content');
      }
    }),
});

function truncateToLastSentence(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  const truncated = text.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastExclamation = truncated.lastIndexOf('!');
  const lastQuestion = truncated.lastIndexOf('?');
  const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion);
  if (lastSentenceEnd === -1) {
    const lastSpace = truncated.lastIndexOf(' ');

    return lastSpace === -1 ? truncated : truncated.substring(0, lastSpace);
  }

  return text.substring(0, lastSentenceEnd + 1);
}
