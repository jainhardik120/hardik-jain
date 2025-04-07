import '@/styles/globals.css';
import { useEffect, useRef, useState } from 'react';

import { Excalidraw, MainMenu } from '@excalidraw/excalidraw';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import { useTheme } from 'next-themes';
import { useDebouncedCallback } from 'use-debounce';

import type { ExcalidrawImportData } from '@/lib/excalidraw';
import { trpc } from '@/server/api/pages';

// eslint-disable-next-line import/no-unresolved
import '@excalidraw/excalidraw/index.css';

import type { ExcalidrawElement, Theme } from '@excalidraw/excalidraw/element/types';
import type {
  BinaryFileData,
  BinaryFiles,
  ExcalidrawImperativeAPI,
} from '@excalidraw/excalidraw/types';

export default function ExcalidrawWrapper({
  id,
  initialData,
  setMessage,
  setError,
}: {
  id: string;
  initialData: ExcalidrawImportData;
  setMessage: (message: string) => void;
  setError: (error: string | undefined) => void;
}) {
  const [excalidrawApi, setExcalidrawApi] = useState<ExcalidrawImperativeAPI | null>(null);
  const { resolvedTheme } = useTheme();

  const previousFiles = useRef<BinaryFileData[]>(cloneDeep(initialData.files));
  const previousElements = useRef<ExcalidrawElement[]>(cloneDeep(initialData.elements));

  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (!excalidrawApi) {
      return;
    }
    setMessage('Loading initial data...');
    try {
      excalidrawApi.addFiles(initialData.files);
      excalidrawApi.updateScene({ elements: initialData.elements });
    } catch (error) {
      setError(`Error loading initial data: ${error}`);
    }

    setDataLoaded(true);

    const files = excalidrawApi.getFiles();
    previousFiles.current = Object.values(files).map((file) => cloneDeep(file));
    previousElements.current = cloneDeep(
      excalidrawApi.getSceneElementsIncludingDeleted() as ExcalidrawElement[],
    );
    setMessage('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excalidrawApi, initialData]);

  const signedUrlForPut = trpc.excalidraw.getSignedUrlForPutFiles.useMutation();

  const updateElementsMutation = trpc.excalidraw.updateElements.useMutation();

  const handleFileChange = useDebouncedCallback(async (updatedFiles: BinaryFileData[]) => {
    setMessage('Uploading files...');
    try {
      const signedUrl = await signedUrlForPut.mutateAsync({ id });
      await fetch(signedUrl ?? '', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: updatedFiles }),
      });
    } catch (error) {
      setError(`Error uploading files: ${error}`);
    } finally {
      setMessage('');
    }
  }, 1000);

  const handleElementsChange = useDebouncedCallback(
    async (updatedElements: ExcalidrawElement[]) => {
      setMessage('Updating elements...');
      try {
        await updateElementsMutation.mutateAsync({
          id,
          elements: JSON.stringify(updatedElements),
        });
      } catch (error) {
        setError(`Error updating elements: ${error}`);
      } finally {
        setMessage('');
      }
    },
    1000,
  );

  const debouncedUpdates = useDebouncedCallback(
    (elements: readonly ExcalidrawElement[], files: BinaryFiles) => {
      if (!dataLoaded) {
        return;
      }
      const newFiles: BinaryFileData[] = Object.values(files).map((file) => cloneDeep(file));
      if (!isEqual(newFiles, previousFiles.current)) {
        previousFiles.current = newFiles;
        void handleFileChange(newFiles);
      }
      const newElements: ExcalidrawElement[] = cloneDeep(elements as ExcalidrawElement[]);
      if (!isEqual(newElements, previousElements.current)) {
        previousElements.current = newElements;
        void handleElementsChange(newElements);
      }
    },
    500,
  );

  return (
    <Excalidraw
      excalidrawAPI={(api) => setExcalidrawApi(api)}
      onChange={(elements, _, files) => {
        debouncedUpdates(elements, files);
      }}
      theme={resolvedTheme as Theme}
    >
      <MainMenu>
        <MainMenu.DefaultItems.Export />
        <MainMenu.DefaultItems.SaveAsImage />
        <MainMenu.DefaultItems.ClearCanvas />
        <MainMenu.DefaultItems.LoadScene />
        <MainMenu.DefaultItems.ChangeCanvasBackground />
      </MainMenu>
    </Excalidraw>
  );
}
