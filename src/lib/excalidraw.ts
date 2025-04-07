import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';
import type { BinaryFiles } from '@excalidraw/excalidraw/types';

export type ExcalidrawImportData = { elements: ExcalidrawElement[]; files: BinaryFiles };

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
    const filesData = (await filesResponse.json()) as { files?: BinaryFiles };
    const files = filesData.files ?? {};
    const combinedData: ExcalidrawImportData = {
      elements: elementsData.elements ?? [],
      files: files,
    };

    return combinedData;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(error.message);
    }
    throw error;
  }
};
