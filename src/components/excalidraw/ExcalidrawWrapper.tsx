import '@/styles/globals.css';
import type {
  BinaryFileData,
  BinaryFiles,
  ExcalidrawImperativeAPI,
} from '@excalidraw/excalidraw/types/types';
import { useEffect, useState } from 'react';
import { Excalidraw, MainMenu } from '@excalidraw/excalidraw';
import { useTheme } from 'next-themes';
import type { ExcalidrawElement, Theme } from '@excalidraw/excalidraw/types/element/types';
import type { ExcalidrawImportData } from '@/lib/excalidraw';
import { trpc } from '@/server/api/pages';
import { useDebouncedCallback } from 'use-debounce';
import _ from 'lodash';

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
}): JSX.Element {
  const [excalidrawApi, setExcalidrawApi] = useState<ExcalidrawImperativeAPI | null>(null);
  const { resolvedTheme } = useTheme();

  const [previousFiles, setPreviousFiles] = useState<BinaryFileData[]>(
    _.cloneDeep(initialData.files),
  );
  const [previousElements, setPreviousElements] = useState<ExcalidrawElement[]>(
    _.cloneDeep(initialData.elements),
  );

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
    setPreviousFiles(Object.values(files).map((file) => _.cloneDeep(file)));
    setPreviousElements(
      _.cloneDeep(excalidrawApi.getSceneElementsIncludingDeleted() as ExcalidrawElement[]),
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
      const newFiles: BinaryFileData[] = Object.values(files).map((file) => _.cloneDeep(file));
      if (!_.isEqual(newFiles, previousFiles)) {
        setPreviousFiles(newFiles);
        void handleFileChange(newFiles);
      }
      const newElements: ExcalidrawElement[] = _.cloneDeep(elements as ExcalidrawElement[]);
      if (!_.isEqual(newElements, previousElements)) {
        setPreviousElements(newElements);
        void handleElementsChange(newElements);
      }
    },
    500,
  );

  return (
    <Excalidraw
      excalidrawAPI={(api) => setExcalidrawApi(api)}
      onChange={(elements, appstate, files) => {
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
