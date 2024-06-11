"use server";
import dbConnect from "@/lib/dbConnect";
import Post, { IPost } from "@/models/Post";
import { generateHTML } from "@tiptap/html";
import Blockquote from '@tiptap/extension-blockquote';
import Bold from '@tiptap/extension-bold';
import BubbleMenu from '@tiptap/extension-bubble-menu';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import CharacterCount from '@tiptap/extension-character-count';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
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

export const getPostMetadata = async (id: string) => {
  await dbConnect();
  const { title, description } = await Post.findById(id).select('title description');
  if (!title || !description) {
    return null;
  }
  return { title, description };
};

export const getPostContent = async (id: string) => {
  await dbConnect();
  const post: IPost | null = await Post.findById(id);
  if (!post || !post.content) {
    return null;
  }
  post.content = generateHTML(JSON.parse(post.content), [
    Blockquote,
    Bold,
    BubbleMenu,
    BulletList,
    ListItem,
    TextStyle,
    CharacterCount,
    Code,
    CodeBlock,
    CodeBlockLowlight,
    Color,
    Document,
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
    YouTube
  ])
  return post
}
