'use client';

import { useEffect, useState } from 'react';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

import { Skeleton } from '@repo/ui/skeleton';

import { useTextStore } from '@/hooks/useTextStore';
import type { ExcalidrawImportData } from '@/lib/excalidraw';
import { importExcalidraw } from '@/lib/excalidraw';
import { api } from '@/server/api/react';

const ExcalidrawWrapper = dynamic(
  async () => await import('@/components/excalidraw/ExcalidrawWrapper'),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-full rounded-none" />,
  },
);

export default function ExcalidrawPage() {
  const params = useParams<{ id: string }>();
  const signedUrl = api.excalidraw.getSignedUrlDesign.useQuery(
    { id: params?.id ?? '' },
    { enabled: false },
  );
  const [initialExcalidrawData, setInitialExcalidrawData] = useState<
    ExcalidrawImportData | undefined
  >(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const setMessage = useTextStore((state) => state.setText);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setMessage('Fetching data url...');
      await signedUrl.refetch();
      setMessage('');
    };
    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!signedUrl.data) {
      return;
    }
    setMessage('Downloading data...');
    importExcalidraw(signedUrl.data.elementsUrl, signedUrl.data.filesUrl)
      .then((data) => {
        setInitialExcalidrawData(data);
      })
      .catch((error) => {
        setError(`Error downloading data, ${error}`);
      })
      .finally(() => {
        setMessage('');
        setIsLoaded(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedUrl.data]);

  return (
    <>
      {error !== undefined ? (
        <div>{error}</div>
      ) : !(isLoaded && initialExcalidrawData !== undefined) ? (
        <Skeleton className="w-full h-full rounded-none" />
      ) : (
        <ExcalidrawWrapper
          initialData={initialExcalidrawData}
          id={params?.id ?? ''}
          setMessage={setMessage}
          setError={setError}
        />
      )}
    </>
  );
}
