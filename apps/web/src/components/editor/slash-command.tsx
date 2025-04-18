import {
  CheckSquare,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  List,
  ListOrdered,
  MessageSquarePlus,
  Text,
  TextQuote,
  Youtube,
} from 'lucide-react';
import { createSuggestionItems, Command, renderItems } from 'novel';

import { client } from '@/server/api/react';

import { uploadFn } from './image-upload';

export const suggestionItems = createSuggestionItems([
  {
    title: 'Send Feedback',
    description: 'Let us know how we can improve.',
    icon: <MessageSquarePlus size={18} />,
    command: ({ editor, range }): void => {
      editor.chain().focus().deleteRange(range).run();
      window.open('/feedback', '_blank');
    },
  },
  {
    title: 'Text',
    description: 'Just start typing with plain text.',
    searchTerms: ['p', 'paragraph'],
    icon: <Text size={18} />,
    command: ({ editor, range }): void => {
      editor.chain().focus().deleteRange(range).toggleNode('paragraph', 'paragraph').run();
    },
  },
  {
    title: 'To-do List',
    description: 'Track tasks with a to-do list.',
    searchTerms: ['todo', 'task', 'list', 'check', 'checkbox'],
    icon: <CheckSquare size={18} />,
    command: ({ editor, range }): void => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    title: 'Heading 1',
    description: 'Big section heading.',
    searchTerms: ['title', 'big', 'large'],
    icon: <Heading1 size={18} />,
    command: ({ editor, range }): void => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
    },
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading.',
    searchTerms: ['subtitle', 'medium'],
    icon: <Heading2 size={18} />,
    command: ({ editor, range }): void => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
    },
  },
  {
    title: 'Heading 3',
    description: 'Small section heading.',
    searchTerms: ['subtitle', 'small'],
    icon: <Heading3 size={18} />,
    command: ({ editor, range }): void => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
    },
  },
  {
    title: 'Bullet List',
    description: 'Create a simple bullet list.',
    searchTerms: ['unordered', 'point'],
    icon: <List size={18} />,
    command: ({ editor, range }): void => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: 'Numbered List',
    description: 'Create a list with numbering.',
    searchTerms: ['ordered'],
    icon: <ListOrdered size={18} />,
    command: ({ editor, range }): void => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: 'Quote',
    description: 'Capture a quote.',
    searchTerms: ['blockquote'],
    icon: <TextQuote size={18} />,
    command: ({ editor, range }): boolean =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode('paragraph', 'paragraph')
        .toggleBlockquote()
        .run(),
  },
  {
    title: 'Code',
    description: 'Capture a code snippet.',
    searchTerms: ['codeblock'],
    icon: <Code size={18} />,
    command: ({ editor, range }): boolean =>
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: 'Image',
    description: 'Upload an image from your computer.',
    searchTerms: ['photo', 'picture', 'media'],
    icon: <ImageIcon size={18} />,
    command: ({ editor, range }): void => {
      editor.chain().focus().deleteRange(range).run();
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (): Promise<void> => {
        if (input.files?.length !== undefined) {
          const file = input.files[0];
          const pos = editor.view.state.selection.from;
          if (file) {
            uploadFn(file, editor.view, pos);
          }
        }
      };
      input.click();
    },
  },
  {
    title: 'Youtube',
    description: 'Embed a Youtube video.',
    searchTerms: ['video', 'youtube', 'embed'],
    icon: <Youtube size={18} />,
    command: ({ editor, range }): void => {
      const videoLink = prompt('Please enter Youtube Video Link');
      const ytregex = new RegExp(
        // eslint-disable-next-line max-len
        /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/,
      );
      if (videoLink !== null) {
        if (ytregex.test(videoLink)) {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setYoutubeVideo({
              src: videoLink,
            })
            .run();
        } else {
          if (videoLink !== null) {
            alert('Please enter a correct Youtube Video Link');
          }
        }
      } else {
        alert('Please enter a Youtube Video Link');
      }
    },
  },
  {
    title: 'Generate with AI',
    description: 'Generate text with AI that fits with your current content',
    searchTerms: ['ai', 'gemini', 'generative'],
    icon: <Youtube size={18} />,
    command: ({ editor, range }): void => {
      const generativeAI = async (): Promise<void> => {
        const ai_prompt = prompt('Enter what you want to write about:');
        if (ai_prompt !== null) {
          const beforeContent = editor.state.doc.textBetween(0, range.from);
          const afterContent = editor.state.doc.textBetween(
            range.to,
            editor.state.doc.content.size,
          );

          const response = await client.post.generateAIContent.query({
            query: ai_prompt,
            context: {
              beforeText: beforeContent,
              afterText: afterContent,
              position: {
                from: range.from,
                to: range.to,
              },
            },
          });
          editor.chain().focus().deleteRange(range).insertContent(response).run();
        } else {
          alert('Enter a prompt to generate content');
        }
      };
      void generativeAI();
    },
  },
]);

export const slashCommand = Command.configure({
  suggestion: {
    items: () => suggestionItems,
    render: renderItems,
  },
});
