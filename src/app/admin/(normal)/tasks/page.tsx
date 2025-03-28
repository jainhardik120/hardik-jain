import { DataTable } from '@/components/DataTable';
import { api } from '@/server/api/server';
import { columns } from './TableColumns';
import CreateBoardButton from './CreateBoardButton';

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
