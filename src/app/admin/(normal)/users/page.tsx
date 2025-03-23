import { DataTable } from '@/components/DataTable';
import { api } from '@/server/api/server';

export default async function Users(): Promise<JSX.Element> {
  const users = await api.user.listUsers();
  return (
    <DataTable
      data={users}
      columns={[
        {
          header: 'Name',
          accessorKey: 'name',
          id: 'name',
        },
        {
          header: 'Email',
          accessorKey: 'email',
          id: 'email',
        },
      ]}
      filterOn="name"
      name="Users"
      CreateButton={<></>}
    />
  );
}
