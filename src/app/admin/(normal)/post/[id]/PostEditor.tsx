'use client';

import { useRef, useState, useEffect, type RefObject } from 'react';

import dynamic from 'next/dynamic';

import { Zap } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

import type { EditorRef } from '@/components/editor/advanced-editor';
import RenderedForm from '@/components/form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useTextStore } from '@/hooks/useTextStore';
import { api } from '@/server/api/react';
import type { Topic } from '@/server/api/routers/post';
import { PostSchema } from '@/types/schemas';

import type { Post } from '@prisma/client';
import type { JSONContent } from 'novel';
import type { UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';

const Editor = dynamic(() => import('@/components/editor/advanced-editor'), { ssr: false });

const ReferenceInput = ({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
}) => {
  const [textAreaValue, setTextAreaValue] = useState<string>('');

  useEffect(() => {
    setTextAreaValue(value.join('\n\n---\n\n'));
  }, [value]);

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextAreaValue(value);
    const updatedValues = value
      .split('---')
      .map((item) => item.trim())
      .filter((item) => item !== '');
    onChange(updatedValues);
  };

  return (
    <Textarea
      value={textAreaValue}
      onChange={handleTextAreaChange}
      placeholder={placeholder}
      className="h-32"
    />
  );
};

const AIGeneration = ({
  form,
  editorRef,
}: {
  form: UseFormReturn<z.infer<typeof PostSchema>>;
  editorRef: RefObject<EditorRef>;
}) => {
  const title = form.watch('title');
  const [aiSuggestions, setAiSuggestions] = useState<Topic[]>([]);
  const [keypoints, setKeypoints] = useState('');
  const [outline, setOutline] = useState('');
  const [referenceCode, setReferenceCode] = useState<string[]>([]);
  const [existingArticles, setExistingArticles] = useState<string[]>([]);
  const [documentation, setDocumentation] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const generateTitlesMutation = api.post.generateTitles.useMutation();
  const generateOutlineMutation = api.post.generateOutline.useMutation();
  const generateBlogContentMutation = api.post.generateBlogContent.useMutation();
  const generateDescriptionMutation = api.post.generateDescription.useMutation();
  const runWithProcessing = async (fn: () => Promise<void>) => {
    setIsProcessing(true);
    try {
      await fn();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateTitles = () =>
    runWithProcessing(async () => {
      if (title) {
        const result = await generateTitlesMutation.mutateAsync({ topic: title });
        setAiSuggestions(result);
      }
    });

  const handleSelectTitle = (topic: Topic) => {
    form.setValue('title', topic.title);
    setKeypoints(topic.outline.keyPoints.join('\n'));
  };

  const handleGenerateOutline = () =>
    runWithProcessing(async () => {
      if (!title || !keypoints) {
        return;
      }
      const generatedOutline = await generateOutlineMutation.mutateAsync({
        title,
        keypoints,
      });
      setOutline(generatedOutline);
    });

  const handleGenerateAIContent = () =>
    runWithProcessing(async () => {
      const aiGeneratedContent = await generateBlogContentMutation.mutateAsync({
        outline,
        referenceCode,
        existingArticles,
        documentation,
      });
      if (editorRef.current) {
        editorRef.current.setContent(aiGeneratedContent);
        const content = editorRef.current.getJSON();
        form.setValue('content', JSON.stringify(content));
      }
    });

  const handleGenerateDescription = () =>
    runWithProcessing(async () => {
      const content = editorRef.current?.getJSON();
      if (!content || !title) {
        return;
      }
      const generatedDescription = await generateDescriptionMutation.mutateAsync({
        title,
        content: JSON.stringify(content),
      });
      form.setValue('description', generatedDescription);
    });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg">
          <Zap className="h-6 w-6" />
          <span className="sr-only">Open dialog</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Generation</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <Button onClick={handleGenerateTitles} disabled={isProcessing || !title}>
            Generate AI Title Suggestions
          </Button>
          {aiSuggestions.length > 0 && (
            <div className="grid grid-cols-1">
              {aiSuggestions.map((topic: Topic, index: number) => (
                <div
                  key={index}
                  className="p-4 border rounded m-2 cursor-pointer"
                  onClick={() => handleSelectTitle(topic)}
                >
                  <p className="text-xl">{topic.title}</p>
                  <p>Search Volume: {topic.keywordResearch.searchVolume}</p>
                  <ul className="p-2 list-disc">
                    {topic.outline.keyPoints.map((point: string, pointIndex: number) => (
                      <li key={pointIndex}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          <Textarea
            value={keypoints}
            onChange={(e) => setKeypoints(e.target.value)}
            placeholder="Enter keypoints, one per line"
            className="h-32"
          />
          <Button onClick={handleGenerateOutline} disabled={isProcessing || !title || !keypoints}>
            {isProcessing ? 'Processing...' : 'Generate Outline with AI'}
          </Button>
          <Textarea
            value={outline}
            onChange={(e) => setOutline(e.target.value)}
            placeholder="Enter your article outline here..."
            className="h-32"
          />
          <Tabs defaultValue="code" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="code">Code Examples</TabsTrigger>
              <TabsTrigger value="articles">Existing Articles</TabsTrigger>
              <TabsTrigger value="docs">Documentation</TabsTrigger>
            </TabsList>

            <TabsContent value="code">
              <ReferenceInput
                value={referenceCode}
                onChange={setReferenceCode}
                placeholder="Enter code examples. Separate multiple examples with '---'"
              />
            </TabsContent>

            <TabsContent value="articles">
              <ReferenceInput
                value={existingArticles}
                onChange={setExistingArticles}
                placeholder="Enter existing articles. Separate multiple articles with '---'"
              />
            </TabsContent>

            <TabsContent value="docs">
              <ReferenceInput
                value={documentation}
                onChange={setDocumentation}
                placeholder="Enter documentation content. Separate multiple sections with '---'"
              />
            </TabsContent>
          </Tabs>
          <div className="grid grid-cols-2 space-x-2 w-full">
            <Button onClick={handleGenerateAIContent} disabled={isProcessing || !title || !outline}>
              {isProcessing ? 'Processing...' : 'Generate Content with AI'}
            </Button>
            <Button onClick={handleGenerateDescription} disabled={isProcessing} variant="outline">
              Generate Description
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

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
      FormFooter={({ form }) => <AIGeneration form={form} editorRef={editorRef} />}
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
          type: 'input',
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
