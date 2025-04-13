'use client';

import React, { useEffect } from 'react';

import { Button } from '@repo/ui/button';

import { importExcalidraw } from '@/lib/excalidraw';
import { api } from '@/server/api/react';

const ExportButton = ({ id }: { id: string }) => {
  const { data, refetch } = api.excalidraw.getSignedUrlDesign.useQuery({ id }, { enabled: false });

  useEffect(() => {
    if (data === undefined) {
      return;
    }
    const exportExcalidraw = async () => {
      const importData = await importExcalidraw(data.elementsUrl, data.filesUrl);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const exportToBlob = (await import('@excalidraw/excalidraw')).exportToBlob;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const blob = (await exportToBlob({
        elements: importData.elements,
        files: importData.files,
        mimeType: 'image/png',
        quality: 1,
        exportPadding: 10,
      })) as Blob;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'excalidraw-export.png';
      a.click();
      URL.revokeObjectURL(url);
    };
    void exportExcalidraw();
  }, [data]);

  return (
    <Button
      onClick={() => {
        void refetch();
      }}
    >
      Export
    </Button>
  );
};

export default ExportButton;
