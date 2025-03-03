import dynamic from 'next/dynamic';
import { useEffect, useState, useRef } from 'react';
import { trpc } from '@/server/api/pages';
import type { ExcalidrawImportData } from '@/lib/excalidraw';
import { importExcalidraw } from '@/lib/excalidraw';
import { SidebarLayout } from '@/components/sidebar/sidebar-layout';
import { Skeleton } from '@/components/ui/skeleton';
import { useTextStore } from '@/components/sidebar/useTextStore';
import Header from '@/components/sidebar/sidebar-header';

const ExcalidrawWrapper = dynamic(
  async () => await import('@/components/excalidraw/ExcalidrawWrapper'),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-full rounded-none" />,
  },
);

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
  const setMessage = useTextStore((state) => state.setText);
  const defaultAvatarRef = useRef(
    // eslint-disable-next-line max-len
    `https://api.dicebear.com/9.x/thumbs/svg?seed=${Math.floor(Math.random() * 100000) + 1}&randomizeIds=true`,
  );

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
    <SidebarLayout
      defaultOpen={true}
      user={{
        name: session?.user?.name ?? '',
        email: session?.user?.email ?? '',
        avatar: session?.user?.image ?? defaultAvatarRef.current,
      }}
    >
      <Header />
      {error !== undefined ? (
        <div>{error}</div>
      ) : !(isLoaded && initialExcalidrawData !== undefined) ? (
        <Skeleton className="w-full h-full rounded-none" />
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
