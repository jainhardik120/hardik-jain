import { DataTable } from '@/components/DataTable';
import { api } from '@/server/api/server';

import { columns } from './columns';

export default async function Page() {
  const messages = await api.contact.listMessages();

  return (
    <DataTable
      columns={columns}
      data={messages}
      CreateButton={<></>}
      filterOn="email"
      name="Messages"
    />
  );
}
