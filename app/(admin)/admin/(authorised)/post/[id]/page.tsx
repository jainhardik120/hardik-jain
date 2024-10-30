"use client"

import Editor, { EditorRef } from "@/components/editor/advanced-editor";
import { IPost } from "@/models/Post";
import { JSONContent } from "novel";
import { useEffect, useRef, useState } from "react";
import { defaultValue } from "@/components/editor/default-value";
import { Input } from "@/components/ui/input";
import { Label } from "react-konva";
import generateTitles, { Topic } from "@/lib/actions/generateTitles";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateOutline } from "@/lib/actions/generateOutline";
import { generateBlogContentUsingOutline } from "@/lib/actions/generateBlogContentUsingOutline";
import { generateDescription } from "@/lib/actions/generateDescriptionFromContent";


const KeypointInput = ({ keypoints, setKeypoints }: { keypoints: string[], setKeypoints: (keypoints: string[]) => void }) => {
  const [textAreaValue, setTextAreaValue] = useState<string>("");

  // Effect to set the textarea value whenever keypoints change
  useEffect(() => {
    setTextAreaValue(keypoints.join("\n")); // Join keypoints with new lines for the textarea
  }, [keypoints]);

  // Update keypoints whenever the text area changes
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextAreaValue(value);

    // Split by new lines to create an array of keypoints
    const updatedKeypoints = value.split("\n").map(kp => kp.trim()).filter(kp => kp !== "");
    setKeypoints(updatedKeypoints);
  };

  return (
    <div className="space-y-2">
      <textarea
        value={textAreaValue}
        onChange={handleTextAreaChange}
        placeholder="Enter keypoints, one per line"
        className="border p-2 rounded w-full h-32"
      />
    </div>
  );
};
const ReferenceInput = ({
  value,
  onChange,
  placeholder
}: {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
}) => {
  const [textAreaValue, setTextAreaValue] = useState<string>("");

  useEffect(() => {
    setTextAreaValue(value.join("\n\n---\n\n"));
  }, [value]);

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextAreaValue(value);
    const updatedValues = value.split("---").map(item => item.trim()).filter(item => item !== "");
    onChange(updatedValues);
  };

  return (
    <textarea
      value={textAreaValue}
      onChange={handleTextAreaChange}
      placeholder={placeholder}
      className="border p-2 rounded w-full h-48 font-mono text-sm"
    />
  );
};

export default function Page({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [initialContent, setInitialContent] = useState<JSONContent | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<Topic[]>([]);
  const [keypoints, setKeypoints] = useState<string[]>([]);
  const [outline, setOutline] = useState("");
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const editorRef = useRef<EditorRef>(null);
  const [referenceCode, setReferenceCode] = useState<string[]>([]);
  const [existingArticles, setExistingArticles] = useState<string[]>([]);
  const [documentation, setDocumentation] = useState<string[]>([]);


  useEffect(() => {
    const getDocument = async () => {
      const response = await fetch(`/api/posts/${params.id}`, { method: "GET" });
      const json: IPost = await response.json();
      setTitle(json.title || "");
      setDescription(json.description || "");
      setInitialContent(JSON.parse(json.content || "") || defaultValue)
      setLoading(false);
    }
    getDocument();
  }, [params.id]);


  const handleGenerateTitles = async () => {
    if (title) {
      const result = await generateTitles(title);
      setAiSuggestions(result);
    }
  };


  const handleSelectTitle = (topic: Topic) => {
    setTitle(topic.title);
    setKeypoints(topic.outline.keyPoints);
  };


  const handleGenerateOutline = async () => {
    setIsGeneratingOutline(true);
    try {
      const generatedOutline = await generateOutline(title, keypoints);
      setOutline(generatedOutline);
    } catch (error) {
      console.error("Error generating outline:", error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsGeneratingOutline(false);
    }
  };


  const handleGenerateAIContent = async () => {
    setIsGeneratingContent(true);
    try {
      const aiGeneratedContent = await generateBlogContentUsingOutline(
        outline,
        referenceCode,
        existingArticles,
        documentation
      );
      console.log(aiGeneratedContent);
      if (editorRef.current) {
        editorRef.current.setContent(aiGeneratedContent);
      }
    } catch (error) {
      console.error("Error generating AI content:", error);
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const handleSave = async (content: JSONContent) => {
    await fetch(`/api/posts/${params.id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        content: JSON.stringify(content),
        description: description
      }),
    });
  };

  const handleGenerateDescription = async () => {
    try {
      // Get the current editor content
      const content = editorRef.current?.getJSON();
      if (!content || !title) return;

      const generatedDescription = await generateDescription(
        title,
        JSON.stringify(content)
      );

      setDescription(generatedDescription);
    } catch (error) {
      console.error("Error generating description:", error);
    }
  };


  if (loading) {
    return <div>Loading...</div>
  }
  return (
    <div className="container mx-auto px-4 grid gap-4 mt-1">
      <div className="space-y-2">
        <Label>Title</Label>
        <div className="flex flex-row w-full space-x-4">
          <Input
            className="flex-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <Button onClick={handleGenerateTitles}>AI Suggest</Button>
        </div>

      </div>
      <Accordion type="single" collapsible defaultValue="keypoints">

        <AccordionItem value="aisuggestions">
          <AccordionTrigger>AI Suggestions</AccordionTrigger>
          <AccordionContent>
            {aiSuggestions && (
              <div className="grid grid-cols-1 md:grid-cols-3">
                {aiSuggestions.map((topic: Topic, index: number) => (
                  <div key={index} className="p-4 border rounded m-2" onClick={() => handleSelectTitle(topic)}>
                    <p className="text-xl">
                      {topic.title}
                    </p>
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
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="keypoints">
          <AccordionTrigger>Keypoints</AccordionTrigger>
          <AccordionContent>
            <KeypointInput keypoints={keypoints} setKeypoints={setKeypoints} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="outline">
          <AccordionTrigger>Outline</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col space-y-2">
              <Button
                onClick={handleGenerateOutline}
                disabled={isGeneratingOutline || !title || keypoints.length === 0}
              >
                {isGeneratingOutline ? "Generating..." : "Generate Outline with AI"}
              </Button>
              <textarea
                className="w-full h-64 p-2 border rounded"
                value={outline}
                onChange={(e) => setOutline(e.target.value)}
                placeholder="Enter your article outline here..."
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="references">
          <AccordionTrigger>Reference Materials</AccordionTrigger>
          <AccordionContent>
            <Tabs defaultValue="code" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="code">Code Examples</TabsTrigger>
                <TabsTrigger value="articles">Existing Articles</TabsTrigger>
                <TabsTrigger value="docs">Documentation</TabsTrigger>
              </TabsList>

              <TabsContent value="code">
                <div className="space-y-2">
                  <Label>Code Examples</Label>
                  <ReferenceInput
                    value={referenceCode}
                    onChange={setReferenceCode}
                    placeholder="Enter code examples. Separate multiple examples with '---'"
                  />
                </div>
              </TabsContent>

              <TabsContent value="articles">
                <div className="space-y-2">
                  <Label>Existing Articles</Label>
                  <ReferenceInput
                    value={existingArticles}
                    onChange={setExistingArticles}
                    placeholder="Enter existing articles. Separate multiple articles with '---'"
                  />
                </div>
              </TabsContent>

              <TabsContent value="docs">
                <div className="space-y-2">
                  <Label>Documentation</Label>
                  <ReferenceInput
                    value={documentation}
                    onChange={setDocumentation}
                    placeholder="Enter documentation content. Separate multiple sections with '---'"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="space-y-2">
        <Label>Content</Label>
        <div className="flex flex-col space-y-2">
          <Button
            onClick={handleGenerateAIContent}
            disabled={isGeneratingContent || !title || !outline}
          >
            {isGeneratingContent ? "Generating..." : "Generate Content with AI"}
          </Button>
          <Editor
            ref={editorRef}
            initialValue={initialContent ? initialContent : defaultValue}
            onChange={handleSave}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <div className="flex flex-row space-x-2">
          <Input
            className="flex-1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button
            onClick={handleGenerateDescription}
            variant="outline"
          >
            Generate
          </Button>
        </div>
        <p className="text-sm text-gray-500">
          {description.length}/160 characters
        </p>
      </div>
    </div>
  )
}