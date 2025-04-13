'use client';

import { useEffect } from 'react';

import { useParams } from 'next/navigation';

import { Button } from '@repo/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@repo/ui/card';
import { Download, FileIcon, Loader2 } from 'lucide-react';

import { api } from '@/server/api/react';

export default function SharePage() {
  const params = useParams();
  const shareId = params?.['id'] as string;

  const {
    data: share,
    isLoading,
    error,
  } = api.shares.getShareById.useQuery(
    { shareId },
    {
      retry: false,
    },
  );

  useEffect(() => {
    if (share !== undefined) {
      document.title = `Download ${share.fileName}`;
    }
  }, [share]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Loading shared file...</p>
      </div>
    );
  }

  if (error || share === undefined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Share Link Invalid</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              This share link has expired and is no longer available.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Download File</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="bg-muted rounded-lg p-6 mb-4">
            <FileIcon className="h-16 w-16 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">{share.fileName}</h2>
          <p className="text-sm text-muted-foreground mb-4">
            This link will expire on {new Date(share.expiresAt).toLocaleString()}
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" asChild>
            <a
              href={share.signedUrl}
              download={share.fileName}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="h-4 w-4 mr-2" />
              Download File
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
