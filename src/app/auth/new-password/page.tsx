'use client';

import { Suspense, useState, useTransition } from 'react';

import { useSearchParams } from 'next/navigation';

import { CardWrapper } from '@/components/auth/card-wrapper';
import RenderedForm from '@/components/form';
import ErrorSuccessMessage from '@/components/form-success';
import { api } from '@/server/api/react';
import { NewPasswordSchema } from '@/types/schemas';

export default function NewPasswordPage() {
  return (
    <Suspense>
      <NewPasswordForm />
    </Suspense>
  );
}

function NewPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  const [error, setError] = useState<boolean>(false);
  const [message, setMessage] = useState<string | undefined>('');

  const [isPending, startTransition] = useTransition();

  const mutation = api.auth.newPassword.useMutation({
    onSuccess: async (values) => {
      setMessage(values.success);
    },
    onError: async (values) => {
      setMessage(values.message);
      setError(true);
    },
  });

  return (
    <CardWrapper
      headerLabel="Enter a new password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/signin"
    >
      <RenderedForm
        schema={NewPasswordSchema}
        onSubmit={async (values) => {
          setError(false);
          setMessage('');
          startTransition(() => {
            mutation.mutate({ ...values, token: token ?? '' });
          });
        }}
        defaultValues={{
          password: '',
        }}
        FormFooter={() => <ErrorSuccessMessage message={message} isError={error} />}
        submitButtonDisabled={isPending}
        fields={[{ type: 'password', name: 'password', label: 'Password', placeholder: '******' }]}
      />
    </CardWrapper>
  );
}
