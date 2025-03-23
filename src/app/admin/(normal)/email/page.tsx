import { DataTable } from '@/components/DataTable';
import { api } from '@/server/api/server';
import { columns } from './TableColumns';
import CreateEmailButton from './CreateEmailButton';

export default async function Page() {
  const emailTemplates = await api.email.listEmailTemplates();
  return (
    <DataTable
      data={emailTemplates}
      columns={columns}
      name="Email Templates"
      CreateButton={<CreateEmailButton />}
      filterOn="title"
    />
  );
}
