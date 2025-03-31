'use client';

import React from 'react';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { env } from '@/env';
import { api } from '@/server/api/react';

export const DesignExportButton: React.FC<{ designId: string }> = ({ designId }) => {
  const mutation = api.canva.exportDesign.useMutation();
  const { data, isFetching, refetch } = api.canva.listExports.useQuery(designId, {
    // Disable automatic fetching on mount
    enabled: false,
  });

  return (
    <Popover
      onOpenChange={(open) => {
        // Only fetch data when the popover is opened
        if (open) {
          void refetch();
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline">Exports</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div>
          <div>
            <ul>
              {data &&
                data.jobs.map((item) => {
                  return <li key={item.exportId}>{`${item.exportId} : ${item.status}`}</li>;
                })}
              {data &&
                data.exportedImages.map((item) => {
                  return (
                    <li key={item.Key}>
                      <Image
                        src={`${env.NEXT_PUBLIC_FILE_STORAGE_HOST}/${(item.Key ?? '').split('public/')[1]}`}
                        alt={item.Key ?? ''}
                        height={64}
                        width={64}
                      />
                    </li>
                  );
                })}
            </ul>
          </div>
          <div className="flex flex-row">
            <Button
              onClick={async () => {
                mutation.mutate({ designId });
              }}
            >
              Create new Export
            </Button>
            <Button
              onClick={() => {
                void refetch();
              }}
              disabled={isFetching}
            >
              {isFetching ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
