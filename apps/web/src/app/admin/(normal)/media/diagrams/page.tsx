import Link from 'next/link';

import { Table, TableBody, TableCell, TableHeader, TableRow } from '@repo/ui/table';

import ExportButton from '@/components/excalidraw/ExportButton';
import { api } from '@/server/api/server';

import { CreateDiagramButton } from './CreateDiagramButton';

export default async function DiagramsPage() {
  const designs = await api.excalidraw.listDesigns();

  return (
    <div>
      <CreateDiagramButton />
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Last Modified</TableCell>
            <TableCell>Export</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {designs.map((design) => (
            <TableRow key={design.id}>
              <TableCell>
                <Link href={`/admin/media/diagrams/${design.id}`}>{design.id}</Link>
              </TableCell>
              <TableCell>{design.createdAt.toLocaleString()}</TableCell>
              <TableCell>{design.lastModified.toLocaleString()}</TableCell>
              <TableCell>
                <ExportButton id={design.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
