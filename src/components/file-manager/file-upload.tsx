'use client';

import type React from 'react';
import { useState, useRef } from 'react';

import { Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { api } from '@/server/api/react';

interface FileUploadProps {
  currentPath: string;
  onUploadComplete: () => void;
}

export default function FileUpload({ currentPath, onUploadComplete }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getUploadUrlMutation = api.files.getUploadUrl.useMutation();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file === undefined) {
          continue;
        }
        const fileName = file.name;
        const fileKey = currentPath ? `${currentPath}${fileName}` : fileName;

        const { url, fields } = await getUploadUrlMutation.mutateAsync({
          fileName: fileKey,
          contentType: file.type,
        });

        if (!url) {
          throw new Error('Failed to get upload URL');
        }

        const formData = new FormData();
        Object.entries(fields).forEach(([key, value]) => {
          formData.append(key, value as string);
        });
        formData.append('file', file);

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percentComplete);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            if (i === files.length - 1) {
              setIsUploading(false);
              onUploadComplete();
              toast({
                title: 'Upload complete',
                description: `Successfully uploaded ${files.length} file(s)`,
              });
            }
          } else {
            throw new Error(`Upload failed with status ${xhr.status}`);
          }
        });

        xhr.addEventListener('error', () => {
          throw new Error('Upload failed');
        });

        xhr.open('POST', url);
        xhr.send(formData);
      }
    } catch (error) {
      setIsUploading(false);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <input
        title="File Input"
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
        multiple
      />

      {isUploading ? (
        <div className="flex items-center gap-4">
          <Progress value={uploadProgress} className="w-32" />
          <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
          <Button variant="outline" size="sm" onClick={() => setIsUploading(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      )}
    </div>
  );
}
