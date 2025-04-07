import { DataTable } from '@/components/DataTable';
import { api } from '@/server/api/server';

import { columns } from './columns';

export default async function Page({ params }: { params: Promise<{ path: string[] }> }) {
  const files = await api.files.listUserUploadedFiles(((await params).path ?? ['']).join('/'));
  return (
    <DataTable
      columns={columns}
      data={files}
      CreateButton={<></>}
      name="Uploaded Media"
      filterOn="Key"
    />
  );
}
