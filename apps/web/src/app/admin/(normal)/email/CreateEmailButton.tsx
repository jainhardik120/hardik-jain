'use client';

import React from 'react';

import { Button } from '@repo/ui/button';

import { useRouter } from '@/components/top-loader-router';
import { useTextStore } from '@/hooks/useTextStore';
import { api } from '@/server/api/react';

const CreateEmailButton = () => {
  const router = useRouter();
  const mutation = api.email.createNewEmailTemplate.useMutation();
  const setText = useTextStore((state) => state.setText);
  return (
    <Button
      onClick={async () => {
        setText('Creating...');
        const data = await mutation.mutateAsync('New Email Template');
        setText('');
        router.push(`/admin/email/${data}`);
      }}
    >
      Create Email Template
    </Button>
  );
};

export default CreateEmailButton;
