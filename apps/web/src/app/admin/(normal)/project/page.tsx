import Link from 'next/link';

import { Button } from '@repo/ui/button';

import { DataTable } from '@/components/DataTable';
import { api } from '@/server/api/server';

import { columns } from './columns';

const ProjectsPage = async () => {
  const projects = await api.portfolio.getAllProjects();

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={projects}
        CreateButton={
          <Link href="/admin/project/new">
            <Button>Create Project</Button>
          </Link>
        }
        filterOn="name"
        name="Projects"
      />
    </div>
  );
};

export default ProjectsPage;
