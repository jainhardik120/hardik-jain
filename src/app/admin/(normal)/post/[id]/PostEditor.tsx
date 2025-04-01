'use client';

import { useRef } from 'react';

import dynamic from 'next/dynamic';

import { useDebouncedCallback } from 'use-debounce';

import type { EditorRef } from '@/components/editor/advanced-editor';
import RenderedForm from '@/components/form';
import { useTextStore } from '@/hooks/useTextStore';
import { api } from '@/server/api/react';
import { PostSchema } from '@/types/schemas';

import type { Post } from '@prisma/client';
import type { JSONContent } from 'novel';
import type { z } from 'zod';

const Editor = dynamic(() => import('@/components/editor/advanced-editor'), { ssr: false });

export function PostEditor({ initData }: { initData: Post }): JSX.Element {
  const editorRef = useRef<EditorRef>(null);
  const setText = useTextStore((state) => state.setText);

  const saveMutation = api.post.updatePostById.useMutation();

  const debouncedSave = useDebouncedCallback(async (values: z.infer<typeof PostSchema>) => {
    setText('Saving...');
    await saveMutation.mutateAsync({
      id: initData.id,
      post: values,
    });
    setText('');
  }, 500);

  return (
    <RenderedForm
      schema={PostSchema}
      onSubmit={async () => {}}
      defaultValues={initData}
      onValuesChange={(values) => {
        void debouncedSave(values);
      }}
      fields={[
        {
          name: 'title',
          label: 'Title',
          type: 'input',
          placeholder: 'Enter title',
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          placeholder: 'Enter description',
        },
        {
          name: 'slug',
          label: 'Slug',
          type: 'input',
          placeholder: 'Enter slug',
        },
        {
          name: 'coverImage',
          label: 'Cover Image',
          type: 'image',
        },
        {
          name: 'tags',
          label: 'Tags',
          type: 'stringArray',
        },
        {
          name: 'content',
          label: 'Content',
          type: 'custom',
          placeholder: 'Enter content',
          render: (field) => (
            <Editor
              ref={editorRef}
              initialValue={JSON.parse(initData.content) as JSONContent}
              onChange={() => {
                if (!editorRef.current) {
                  return;
                }
                const content = editorRef.current.getJSON();
                field.onChange(JSON.stringify(content));
              }}
            />
          ),
        },
      ]}
      showSubmitButton={false}
    />
  );
}
