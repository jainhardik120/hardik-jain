import { env } from '@/env';
import { client } from '@/server/api/react';
import { createImageUpload } from 'novel/plugins';
import { toast } from 'sonner';

const stripQueryParameters = (url: string): string => {
  return url.split('?')[0] ?? url;
};

function extractPublicPath(url: string): string | null {
  const match = url.match(/\/public\/(.*)/);

  return match ? (match[1] ?? null) : null;
}

export const onUpload = async (file: File): Promise<string> => {
  const currentDatetime = new Date().toISOString().replace(/[:.]/g, '-');
  const filenameWithDatetime = `${currentDatetime}_${file.name}`;
  const signedUrl = await client.files.signedUrlForPut.mutate({
    filename: filenameWithDatetime,
    filetype: file.type,
  });
  const uploadResponse = await fetch(signedUrl, {
    method: 'PUT',
    body: file,
  });
  if (!uploadResponse.ok) {
    throw new Error('Error occurred during file upload.');
  }
  const publicPath = extractPublicPath(stripQueryParameters(signedUrl));

  return `${env.NEXT_PUBLIC_FILE_STORAGE_HOST}/${publicPath}`;
};

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    if (!file.type.includes('image/')) {
      toast.error('File type not supported.');

      return false;
    }
    if (file.size / 1024 / 1024 > 20) {
      toast.error('File size too big (max 20MB).');

      return false;
    }

    return true;
  },
});
