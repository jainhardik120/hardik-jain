import React, { useMemo } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@repo/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/popover';
import { Separator } from '@repo/ui/separator';
import { ImageIcon, RefreshCw, ExternalLink } from 'lucide-react';
import { type Route } from 'next';

import { env } from '@/env';
import { api } from '@/server/api/react';

export const PreviousImages = ({ setImageUrl }: { setImageUrl: (url: string) => void }) => {
  const images = api.files.listUserUploadedFiles.useQuery('');

  const refreshImages = () => {
    void images.refetch();
  };

  const previousImages = useMemo(() => {
    return (
      images.data?.map((image) => {
        const path: string = image.Key ?? '';
        const relativePath = path.startsWith('public/') ? path.substring('public/'.length) : path;
        return `${env.NEXT_PUBLIC_FILE_STORAGE_HOST}/${relativePath}`;
      }) ?? []
    );
  }, [images.data]);

  return (
    <>
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h4 className="font-medium">Previously Uploaded Images</h4>
          <p className="text-sm text-muted-foreground">Select from your existing images</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={refreshImages}
          disabled={images.isLoading || images.isFetching}
        >
          <RefreshCw
            size={16}
            className={`${images.isLoading || images.isFetching ? 'animate-spin' : ''}`}
          />
        </Button>
      </div>
      <div className="p-4">
        {(images.isLoading || images.isFetching) && (
          <div className="flex justify-center items-center h-[30vh]">
            <div className="text-center">
              <RefreshCw className="mx-auto h-6 w-6 text-muted-foreground animate-spin" />
              <div className="mt-2 text-sm text-muted-foreground">Loading images...</div>
            </div>
          </div>
        )}

        {!images.isLoading && !images.isFetching && previousImages.length === 0 && (
          <div className="flex justify-center items-center h-[30vh]">
            <div className="text-center">
              <ImageIcon className="mx-auto h-6 w-6 text-muted-foreground" />
              <div className="mt-2 text-sm text-muted-foreground">No images found</div>
            </div>
          </div>
        )}

        {!images.isLoading && !images.isFetching && previousImages.length > 0 && (
          <div className="grid grid-cols-3 gap-2 max-h-[30vh] overflow-y-auto">
            {previousImages.map((img, index) => (
              <div
                key={index}
                className="aspect-video relative rounded-md overflow-hidden border cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setImageUrl(img)}
              >
                <Image
                  src={img}
                  alt={`Previous image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator />

      <div className="p-4 flex justify-end">
        <Link href={'/admin/media/uploaded-media' as Route} target="_blank" passHref>
          <Button variant="link" size="sm" className="flex items-center gap-1">
            Manage Media
            <ExternalLink size={14} />
          </Button>
        </Link>
      </div>
    </>
  );
};

export const PreviousImagesButton = ({ setImageUrl }: { setImageUrl: (url: string) => void }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <ImageIcon size={16} className="mr-2" />
          My Images
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <PreviousImages setImageUrl={setImageUrl} />
      </PopoverContent>
    </Popover>
  );
};
