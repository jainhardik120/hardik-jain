'use client';

import { useEffect, useState, useTransition } from 'react';

import { useSearchParams } from 'next/navigation';

import ErrorSuccessMessage from '@/components/form-success';
import { api } from '@/server/api/react';

export function NewVerificationForm() {
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<boolean>(false);
  const [message, setMessage] = useState<string | undefined>('');

  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  const { mutateAsync } = api.auth.verifyEmail.useMutation({
    onSuccess: async (values) => {
      setMessage(values.success);
    },
    onError: async (values) => {
      setMessage(values.message);
      setError(true);
    },
  });

  useEffect(() => {
    if (token === undefined || token === null) {
      setMessage('Missing token!');
      setError(true);
      return;
    }
    startTransition(() => {
      void mutateAsync({ token });
    });
  }, [token, mutateAsync]);

  return (
    <>
      {isPending && <ErrorSuccessMessage message="Verifying your email..." />}
      <ErrorSuccessMessage message={message} isError={error} />
    </>
  );
}
