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
      // Upload each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file === undefined) {
          continue;
        }
        const fileName = file.name;
        const fileKey = currentPath ? `${currentPath}${fileName}` : fileName;

        // Get a pre-signed URL for uploading
        const { url, fields } = await getUploadUrlMutation.mutateAsync({
          fileName: fileKey,
          contentType: file.type,
        });

        if (!url) {
          throw new Error('Failed to get upload URL');
        }

        // Create form data for the upload
        const formData = new FormData();
        Object.entries(fields).forEach(([key, value]) => {
          formData.append(key, value as string);
        });
        formData.append('file', file);

        // Upload the file directly to S3
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percentComplete);
          }
        });

        // Handle completion
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            // Success
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

        // Handle errors
        xhr.addEventListener('error', () => {
          throw new Error('Upload failed');
        });

        // Send the request
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

    // Reset the file input
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
