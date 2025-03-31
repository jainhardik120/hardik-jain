import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { importExcalidraw } from '@/lib/excalidraw';
import { trpc } from '@/server/api/pages';
// import { exportToBlob } from '@excalidraw/excalidraw';
// import {
//   BinaryFileData,
//   BinaryFiles,
// } from '@excalidraw/excalidraw/types/types';

const ExportButton = ({ id }: { id: string }): JSX.Element => {
  const { data, refetch } = trpc.excalidraw.getSignedUrlDesign.useQuery({ id }, { enabled: false });

  useEffect(() => {
    if (data === undefined) {
      return;
    }
    void importExcalidraw(data.elementsUrl, data.filesUrl)
      .then
      // async (importedData) => {
      // const binaryFiles: BinaryFiles = importedData.files.reduce<
      //   Record<string, BinaryFileData>
      // >((acc, file, index) => {
      //   acc[index] = file;
      //   return acc;
      // }, {});
      // const blob = await exportToBlob({
      //   elements: importedData.elements,
      //   files: binaryFiles,
      //   mimeType: 'image/jpeg',
      //   quality: 1,
      //   exportPadding: 10,
      // });
      // },
      ();
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
