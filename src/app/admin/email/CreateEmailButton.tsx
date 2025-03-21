'use client';

import { useRouter } from '@/components/top-loader-router';
import { Button } from '@/components/ui/button';
import { api } from '@/server/api/react';
import React from 'react';

const CreateEmailButton = () => {
  const router = useRouter();
  const mutation = api.email.createNewEmailTemplate.useMutation();

  return (
    <Button
      onClick={async () => {
        const data = await mutation.mutateAsync('New Email Template');
        router.push(`/admin/email/${data}`);
      }}
    >
      Create Email Template
    </Button>
  );
};

export default CreateEmailButton;
