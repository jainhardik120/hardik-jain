import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import type { BinaryFiles, BinaryFileData } from '@excalidraw/excalidraw/types/types';

export const exportExcalidraw = async (
  elements: readonly ExcalidrawElement[],
  files: BinaryFiles,
): Promise<void> => {
  const filesArray: BinaryFileData[] = Object.values(files).map((file) => ({
    ...file,
  }));

  const excalidrawData = JSON.stringify({ elements, files: filesArray });
  try {
    localStorage.setItem('excalidrawData', excalidrawData);
  } catch (error) {
    throw error;
  }
};

export type ExcalidrawImportData = {
  elements: ExcalidrawElement[];
  files: BinaryFileData[];
};

export const importExcalidraw = async (
  elementsUrl: string,
  filesUrl: string,
): Promise<ExcalidrawImportData> => {
  if (!elementsUrl || !filesUrl) {
    throw new Error('Both elementsUrl and filesUrl are required.');
  }
  try {
    const elementsResponse = await fetch(elementsUrl);
    if (!elementsResponse.ok) {
      throw new Error(`Failed to fetch elements file. Status: ${elementsResponse.status}`);
    }
    const elementsData = (await elementsResponse.json()) as { elements?: ExcalidrawElement[] };
    const filesResponse = await fetch(filesUrl);
    if (!filesResponse.ok) {
      throw new Error(`Failed to fetch files file. Status: ${filesResponse.status}`);
    }
    const filesData = (await filesResponse.json()) as { files?: BinaryFileData[] };
    const combinedData: ExcalidrawImportData = {
      elements: elementsData.elements ?? [],
      files: filesData.files ?? [],
    };

    return combinedData;
  } catch {
    throw new Error('Failed to import Excalidraw data.');
  }
};
