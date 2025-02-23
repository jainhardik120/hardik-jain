'use client';
import DesignList from '@/components/canva/list-designs';
import canvaAuth from '@/actions/canvaAuth';
import { Button } from '@/components/ui/button';
import { api } from '@/server/api/react';
import React, { useEffect, useState } from 'react';

export default function ImagePage() {
  const [clientConnected, setClientConnected] = useState(false);
  const isCanvaClientConnected = api.canva.isCanvaClientConnected.useQuery();
  const disconnectCanvaClient = api.canva.disconnectCanvaClient.useMutation();
  useEffect(() => {
    if (isCanvaClientConnected.data !== undefined) {
      setClientConnected(true);
    }
  }, [isCanvaClientConnected.data]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex">
        <Button
          onClick={async () => {
            if (clientConnected) {
              await disconnectCanvaClient.mutateAsync();
              setClientConnected(false);
            } else {
              await canvaAuth();
            }
          }}
          disabled={isCanvaClientConnected.isFetching}
        >
          {isCanvaClientConnected.isFetching
            ? 'Loading...'
            : clientConnected
              ? 'Disconnect'
              : 'Connect'}
        </Button>
      </div>
      {clientConnected && <DesignList />}
    </div>
  );
}
