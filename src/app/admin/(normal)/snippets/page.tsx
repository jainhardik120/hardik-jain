import { DataTable } from '@/components/DataTable';
import { api } from '@/server/api/server';
import { columns } from './TableColumns';
import CreateSnippetButton from './CreateSnippetButton';

const SnippetsPage = async () => {
  const snippets = await api.snippet.getAllSnippets();

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={snippets ?? []}
        CreateButton={<CreateSnippetButton />}
        filterOn="title"
        name="Snippets"
      />
    </div>
  );
};

export default SnippetsPage;
