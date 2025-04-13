'use client';

import React, { useEffect, useState } from 'react';

import { Button } from '@repo/ui/button';

import canvaAuth from '@/actions/canvaAuth';
import { api } from '@/server/api/react';

const CanvaConnection = () => {
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
  return clientConnected ? (
    <Button
      onClick={async () => {
        await mutateAsync();
      }}
      disabled={isPending}
    >
      {isPending ? 'Loading...' : 'Disconnect'}
    </Button>
  ) : (
    <Button
      onClick={async () => {
        await canvaAuth();
      }}
      disabled={isCanvaClientConnected.isFetching}
    >
      {isCanvaClientConnected.isFetching ? 'Loading...' : 'Connect'}
    </Button>
  );
};

export default CanvaConnection;
