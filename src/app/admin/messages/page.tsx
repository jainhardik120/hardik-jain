import { DataTable } from '@/components/DataTable';
import { api } from '@/server/api/server';
import { columns } from './columns';

export default async function Page(): Promise<JSX.Element> {
  const messages = await api.contact.listMessages();

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={messages}
        CreateButton={<></>}
        filterOn="email"
        name="Messages"
      />
    </div>
  );
}
