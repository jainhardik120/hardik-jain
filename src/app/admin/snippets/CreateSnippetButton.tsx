'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { api } from '@/server/api/react';
import { useRouter } from '@/components/top-loader-router';
import { Plus } from 'lucide-react';

const CreateSnippetButton = () => {
  const router = useRouter();
  const mutation = api.snippet.createSnippet.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <Button onClick={() => mutation.mutate()} className="flex items-center gap-2">
      <Plus size={16} />
      New Snippet
    </Button>
  );
};

export default CreateSnippetButton;
