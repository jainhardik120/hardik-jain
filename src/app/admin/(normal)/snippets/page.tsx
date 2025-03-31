import { DataTable } from '@/components/DataTable';
import { api } from '@/server/api/server';

import CreateSnippetButton from './CreateSnippetButton';
import { columns } from './TableColumns';

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
