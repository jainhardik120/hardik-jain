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
import type { BinaryFiles, ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types';

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

  const previousFiles = useRef<BinaryFiles>(cloneDeep(initialData.files));
  const previousElements = useRef<ExcalidrawElement[]>(cloneDeep(initialData.elements));

  useEffect(() => {
    if (!excalidrawApi) {
      return;
    }
    const files = excalidrawApi.getFiles();
    previousFiles.current = cloneDeep(files);
    previousElements.current = cloneDeep(
      excalidrawApi.getSceneElementsIncludingDeleted() as ExcalidrawElement[],
    );
  }, [excalidrawApi]);

  const signedUrlForPut = trpc.excalidraw.getSignedUrlForPutFiles.useMutation();

  const updateElementsMutation = trpc.excalidraw.updateElements.useMutation();

  const handleFileChange = useDebouncedCallback(async (files: BinaryFiles) => {
    setMessage('Uploading files...');
    try {
      const signedUrl = await signedUrlForPut.mutateAsync({ id });
      await fetch(signedUrl ?? '', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: files }),
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
      const newFiles = cloneDeep(files);
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
      initialData={{
        elements: initialData.elements,
        files: initialData.files,
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
