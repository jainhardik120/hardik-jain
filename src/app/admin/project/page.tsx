import { DataTable } from '@/components/DataTable';
import { columns } from './columns';
import { api } from '@/server/api/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
