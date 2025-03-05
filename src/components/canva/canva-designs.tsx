'use client';
import DesignList from '@/components/canva/list-designs';
import canvaAuth from '@/actions/canvaAuth';
import { Button } from '@/components/ui/button';
import { api } from '@/server/api/react';
import React, { useEffect, useState } from 'react';

export default function CanvaDesigns() {
  const [clientConnected, setClientConnected] = useState(false);
  const isCanvaClientConnected = api.canva.isCanvaClientConnected.useQuery();
  const { mutateAsync, isPending } = api.canva.disconnectCanvaClient.useMutation({
    onSuccess: () => {
      setClientConnected(false);
    },
  });
  useEffect(() => {
    if (isCanvaClientConnected.data !== undefined && isCanvaClientConnected.data) {
      setClientConnected(true);
    }
  }, [isCanvaClientConnected.data]);

  return (
    <>
      {clientConnected ? (
        <DesignList
          onDisconnect={async () => {
            await mutateAsync();
          }}
          disconnectButtonDisabled={isPending}
        />
      ) : (
        <Button
          onClick={async () => {
            await canvaAuth();
          }}
          disabled={isCanvaClientConnected.isFetching}
        >
          {isCanvaClientConnected.isFetching ? 'Loading...' : 'Connect'}
        </Button>
      )}
    </>
  );
}
