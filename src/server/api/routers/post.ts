/* eslint-disable max-len */

import model from '@/lib/geminiModel';
import {
  createTRPCRouter,
  permissionCheckProcedure,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import { z } from 'zod';
import { generateSlug } from 'random-word-slugs';

import { generateHTML } from '@tiptap/html';
import Blockquote from '@tiptap/extension-blockquote';
import Bold from '@tiptap/extension-bold';
import BubbleMenu from '@tiptap/extension-bubble-menu';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import TextStyle from '@tiptap/extension-text-style';
import CharacterCount from '@tiptap/extension-character-count';
import Code from '@tiptap/extension-code';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Color from '@tiptap/extension-color';
import Document from '@tiptap/extension-document';
import Dropcursor from '@tiptap/extension-dropcursor';
import FloatingMenu from '@tiptap/extension-floating-menu';
import Gapcursor from '@tiptap/extension-gapcursor';
import HardBreak from '@tiptap/extension-hard-break';
import Heading from '@tiptap/extension-heading';
import Highlight from '@tiptap/extension-highlight';
import History from '@tiptap/extension-history';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Image from '@tiptap/extension-image';
import Italic from '@tiptap/extension-italic';
import Link from '@tiptap/extension-link';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import Strike from '@tiptap/extension-strike';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Text from '@tiptap/extension-text';
import Underline from '@tiptap/extension-underline';
import YouTube from '@tiptap/extension-youtube';
import { revalidatePath } from 'next/cache';

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
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
          slug: true,
          author: {
            select: {
              id: true,
              name: true,
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
  getPostContentBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const { slug } = input;

      const post = await ctx.db.post.findUnique({
        where: { slug },
        select: {
          id: true,
          title: true,
          content: true,
          description: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!post || !post.content) {
        return null;
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

      return {
        id: post.id,
        title: post.title,
        content: renderedContent,
        description: post.description,
        createdAt: post.createdAt,
        authorName: post.author.name,
        authorId: post.author.id,
      };
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

      return post;
    }),
  updatePostById: permissionCheckProcedure('post', 'update')
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        content: z.string(),
        description: z.string(),
        slug: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.post.update({
        where: {
          id: input.id,
          ...(ctx.permission.whereInput ? { AND: ctx.permission.whereInput } : {}),
        },
        data: {
          title: input.title,
          content: input.content,
          description: input.description,
          slug: input.slug,
        },
      });
      revalidatePath('/');
      revalidatePath(`/post/${input.slug}`);
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
      const prompt = `As an expert content writer, your task is to generate content that seamlessly fits within an existing article. You'll be writing specifically about '${input.query}' in a way that naturally connects with the surrounding content.

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
    
    Please generate content that reads as if it was originally written as part of the article, focusing specifically on '${input.query}' while maintaining seamless integration with the surrounding text.`;

      const result = await model.generateContent(prompt);

      return result.response.text();
    }),
});
