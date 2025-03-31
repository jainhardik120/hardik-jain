import React, { useState } from 'react';

import Image from 'next/image';

import { ImageIcon, Upload, ImagePlus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { onUpload } from '@/components/editor/image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { PreviousImagesButton } from './PreviousImages';

const ImageUpload = ({
  imageUrl,
  setImageUrl,
}: {
  imageUrl?: string;
  setImageUrl: (url: string) => void;
}) => {
  const [image, setImage] = useState<File | undefined>();

  return (
    <div>
      {imageUrl !== null && imageUrl !== undefined && imageUrl?.length > 0 ? (
        <>
          <div className="relative mb-4 rounded-md overflow-hidden border border-border">
            <Image
              src={imageUrl}
              alt="Uploaded"
              className="w-full object-cover"
              width={640}
              height={360}
            />
          </div>
          <div className="mb-4">
            <Input value={imageUrl} readOnly className="font-mono text-sm bg-muted" />
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-40 mb-4 border-2 border-dashed rounded-md border-border">
          <div className="text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <div className="mt-2 text-sm text-muted-foreground">No image selected</div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        <div className="relative flex-1">
          <Input
            type="file"
            id="image-upload"
            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImage(e.target.files[0]);
              }
            }}
          />
          <Button variant="outline" className="w-full flex items-center gap-2">
            <ImagePlus size={16} />
            Choose File
          </Button>
        </div>

        <Button
          variant="default"
          type="button"
          className="flex items-center gap-2"
          onClick={async () => {
            if (image !== undefined) {
              try {
                const url = await onUpload(image);
                setImageUrl(url);
                toast.success('Image uploaded successfully');
              } catch (error) {
                if (error instanceof Error) {
                  toast.error(error.message);
                } else {
                  toast.error('An unknown error occurred while uploading the image');
                }
              }
            } else {
              toast.error('Please select an image first');
            }
          }}
        >
          <Upload size={16} />
          Upload
        </Button>

        <PreviousImagesButton setImageUrl={setImageUrl} />

        {imageUrl !== null && imageUrl !== undefined && imageUrl.length > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex items-center gap-2"
                  onClick={() => setImageUrl('')}
                >
                  <Trash2 size={16} />
                  Remove
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove current image</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {image && <p className="mt-2 text-sm text-muted-foreground">Selected: {image.name}</p>}
    </div>
  );
};

export default ImageUpload;
