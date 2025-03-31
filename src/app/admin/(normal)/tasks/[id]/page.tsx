import { KanbanBoard } from '@/components/kanban/kanban-board';
import { KanbanProvider } from '@/components/kanban/kanban-context';
import { api } from '@/server/api/server';

export default async function Home({ params }: { params: Promise<{ id: string }> }) {
  const initialData = await api.tasks.getKanbanData((await params).id);
  return (
    <>
      <h2>{initialData?.title ?? 'Kanban Board'}</h2>
      <KanbanProvider initialData={initialData?.columns ?? []} taskBoardId={initialData?.id ?? ''}>
        <KanbanBoard />
      </KanbanProvider>
    </>
  );
}
