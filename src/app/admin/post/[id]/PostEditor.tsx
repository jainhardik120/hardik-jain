'use client';

import type { EditorRef } from '@/components/editor/advanced-editor';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/server/api/react';
import { useDebouncedCallback } from 'use-debounce';
import type { Post } from '@prisma/client';
import type { JSONContent } from 'novel';
import { useTextStore } from '@/hooks/useTextStore';
const Editor = dynamic(() => import('@/components/editor/advanced-editor'), { ssr: false });

export function PostEditor({ initData }: { initData: Post }): JSX.Element {
  const [title, setTitle] = useState(initData.title);
  const [description, setDescription] = useState(initData.description);
  const [slug, setSlug] = useState(initData.slug);
  const editorRef = useRef<EditorRef>(null);
  const setText = useTextStore((state) => state.setText);

  const saveMutation = api.post.updatePostById.useMutation();

  const debouncedSave = useDebouncedCallback(async () => {
    if (!editorRef.current) {
      return;
    }
    const content = editorRef.current.getJSON();
    setText('Saving...');
    await saveMutation.mutateAsync({
      id: initData.id,
      title,
      content: JSON.stringify(content),
      description,
      slug,
    });
    setText('');
  }, 500);

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setter(e.target.value);
      void debouncedSave();
    };

  return (
    <div className="container mx-auto flex flex-col h-full gap-4 mt-1">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={title} onChange={handleInputChange(setTitle)} autoFocus />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Input value={description} onChange={handleInputChange(setDescription)} />
      </div>
      <div className="space-y-2">
        <Label>Slug</Label>
        <Input value={slug} onChange={handleInputChange(setSlug)} />
      </div>
      <div className="space-y-2">
        <Label>Content</Label>
        <Editor
          ref={editorRef}
          initialValue={JSON.parse(initData.content) as JSONContent}
          onChange={debouncedSave}
        />
      </div>
    </div>
  );
}
