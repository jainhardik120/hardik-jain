'use client';

import { useRouter } from '@/components/top-loader-router';
import { Button } from '@/components/ui/button';
import { api } from '@/server/api/react';

export const CreateDiagramButton = () => {
  const router = useRouter();
  const mutation = api.excalidraw.createDesign.useMutation({
    onSuccess: (response) => {
      router.push(`/admin/media/diagrams/${response}`);
    },
  });

  return (
    <Button
      onClick={async () => {
        mutation.mutate();
      }}
    >
      Create new Diagram
    </Button>
  );
};
