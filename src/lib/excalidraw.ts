import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';
import type { BinaryFiles, BinaryFileData } from '@excalidraw/excalidraw/types';

export const exportExcalidraw = async (
  elements: readonly ExcalidrawElement[],
  files: BinaryFiles,
): Promise<void> => {
  const filesArray: BinaryFileData[] = Object.values(files).map(
    (file): BinaryFileData => ({ ...file }),
  );

  const excalidrawData = JSON.stringify({ elements, files: filesArray });
  try {
    localStorage.setItem('excalidrawData', excalidrawData);
  } catch (error) {
    throw error;
  }
};

export type ExcalidrawImportData = { elements: ExcalidrawElement[]; files: BinaryFileData[] };

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
      const errorText = await elementsResponse.text();
      throw new Error(errorText);
    }
    const elementsData = (await elementsResponse.json()) as { elements?: ExcalidrawElement[] };

    const filesResponse = await fetch(filesUrl);
    if (!filesResponse.ok) {
      const errorText = await filesResponse.text();
      throw new Error(errorText);
    }
    const filesData = (await filesResponse.json()) as { files?: BinaryFileData[] };
    const combinedData: ExcalidrawImportData = {
      elements: elementsData.elements ?? [],
      files: filesData.files ?? [],
    };

    return combinedData;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(error.message);
    }
    throw error;
  }
};
