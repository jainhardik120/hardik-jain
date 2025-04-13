import { env } from '@/env';
import { useTextStore } from '@/hooks/useTextStore';
import { client } from '@/server/api/react';

const stripQueryParameters = (url: string): string => {
  return url.split('?')[0] ?? url;
};

function extractPublicPath(url: string): string | null {
  const match = url.match(/\/public\/(.*)/);

  return match ? (match[1] ?? null) : null;
}

export const onUpload = async (file: File): Promise<string> => {
  useTextStore.getState().setText('Uploading Image...');
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
  useTextStore.getState().setText('');
  return `${env.NEXT_PUBLIC_FILE_STORAGE_HOST}/${publicPath}`;
};
