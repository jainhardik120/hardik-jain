'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';

import { Button } from '@repo/ui/button';

import type { Design, GetListDesignResponse } from '@/canva-client';
import { DataTable } from '@/components/DataTable';
import { api } from '@/server/api/react';

import { CreateDesignForm } from './create-design-form';
import { DesignExportButton } from './export-button';

import type { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Design>[] = [
  {
    id: 'Title',
    header: 'Title',
    accessorKey: 'title',
    cell: (context) => context.getValue() ?? 'Untitled',
  },
  {
    id: 'UpdatedAt',
    header: 'Updated At',
    accessorKey: 'updated_at',
    cell: (context) => {
      const timestamp = context.getValue() as number;
      return new Date(timestamp * 1000).toLocaleString();
    },
  },
  {
    id: 'Thumbnail',
    header: 'Thumbnail',
    accessorKey: 'thumbnail',
    cell: (context) => {
      const thumbnail = context.getValue() as { url: string } | null;
      return thumbnail ? (
        <Image
          src={thumbnail.url}
          alt="Design Thumbnail"
          className="object-cover rounded-md"
          width="64"
          height="96"
        />
      ) : (
        '-'
      );
    },
  },
  {
    id: 'PageCount',
    header: 'Pages',
    accessorKey: 'page_count',
    cell: (context) => context.getValue() ?? '-',
  },
  {
    id: 'Edit',
    header: 'Edit',
    cell: (context) => {
      const design = context.row.original;
      return (
        <a href={design.urls.edit_url} target="_blank" rel="noopener noreferrer">
          <Button>Edit in Canva</Button>
        </a>
      );
    },
  },
  {
    id: 'Export',
    header: 'Export',
    cell: (context) => {
      const design = context.row.original;
      return <DesignExportButton designId={design.id} />;
    },
  },
];

const DesignList = ({ initialData }: { initialData: GetListDesignResponse }) => {
  const [designs, setDesigns] = useState<Design[]>(initialData.items);
  const [continuation, setContinuation] = useState<string | undefined>(initialData.continuation);
  const { data, isFetching, refetch } = api.canva.getUserDesigns.useQuery(
    { continuation },
    { enabled: false },
  );

  useEffect(() => {
    if (data) {
      setDesigns((prev) => [...prev, ...data.items]);
      setContinuation(data.continuation ?? undefined);
    }
  }, [data]);

  return (
    <DataTable
      columns={columns}
      data={designs}
      name="Designs"
      filterOn="Title"
      CreateButton={
        <CreateDesignForm
          onUpdateDesigns={(design) => {
            setDesigns([design, ...designs]);
          }}
        />
      }
      TableFooter={
        <div className="flex justify-center">
          {continuation !== undefined ? (
            <Button onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? 'Loading...' : 'Load More'}
            </Button>
          ) : null}
        </div>
      }
    />
  );
};

export default DesignList;
