import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Header from '@/components/sidebar/sidebar-header';
import { trpc } from '@/server/api/pages';
import type { ExcalidrawImportData } from '@/lib/excalidraw';
import { importExcalidraw } from '@/lib/excalidraw';
import { SidebarLayout } from '@/components/sidebar/sidebar-layout';
import { Skeleton } from '@/components/ui/skeleton';

export async function getServerSideProps(context: {
  params: { id: string };
}): Promise<{ props: { id: string } }> {
  const { id } = context.params;

  return {
    props: {
      id,
    },
  };
}

export default function Page({ id }: { id: string }): JSX.Element {
  const signedUrl = trpc.excalidraw.getSignedUrlDesign.useQuery({ id }, { enabled: false });
  const session = trpc.auth.sessionDetails.useQuery().data || null;
  const [initialExcalidrawData, setInitialExcalidrawData] = useState<
    ExcalidrawImportData | undefined
  >(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState('');
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
  }, [signedUrl.data]);

  const ExcalidrawWrapper = dynamic(
    async () => {
      setMessage('Downloading Excalidraw editor...');
      const excalidrawModule = await import('@/components/excalidraw/ExcalidrawWrapper');
      setMessage('');
      return excalidrawModule.default;
    },
    {
      ssr: false,
      loading: () => <Skeleton className="w-full h-full" />,
    },
  );

  return (
    <SidebarLayout
      defaultOpen={true}
      user={{
        name: session?.user.name ?? '',
        email: session?.user.email ?? '',
        avatar:
          session?.user.image ??
          // eslint-disable-next-line max-len
          `https://api.dicebear.com/9.x/thumbs/svg?seed=${Math.floor(Math.random() * 100000) + 1}&randomizeIds=true`,
      }}
    >
      <Header>
        <div className="flex w-full flex-row justify-between items-center">
          <p>Excalidraw Diagram</p>
          <p>{message}</p>
        </div>
      </Header>
      {error !== undefined ? (
        <div>{error}</div>
      ) : !(isLoaded && initialExcalidrawData !== undefined) ? (
        <Skeleton className="w-full h-full" />
      ) : (
        <ExcalidrawWrapper
          initialData={initialExcalidrawData}
          id={id}
          setMessage={setMessage}
          setError={setError}
        />
      )}
    </SidebarLayout>
  );
}
