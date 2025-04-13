import { DataTable } from '@/components/DataTable';
import { api } from '@/server/api/server';

import CreateBoardButton from './CreateBoardButton';
import { columns } from './TableColumns';

export default async function TasksPage() {
  const boards = await api.tasks.getAllTaskBoards();
  return (
    <DataTable
      data={boards}
      columns={columns}
      name="Tasks"
      CreateButton={<CreateBoardButton />}
      filterOn="title"
    />
  );
}
