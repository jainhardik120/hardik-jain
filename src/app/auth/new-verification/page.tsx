'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import FormSuccess from '@/components/form-success';
import FormError from '@/components/form-error';
import { api } from '@/trpc/react';
import { CardWrapper } from '@/components/auth/card-wrapper';

export default function NewVerificationPage() {
  return (
    <Suspense>
      <NewVerificationForm />
    </Suspense>
  );
}

function NewVerificationForm() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  const { mutate } = api.auth.verifyEmail.useMutation({
    onSuccess: (data) => {
      setSuccess(data.success);
    },
    onError: (data) => {
      setError(data.message);
    },
  });

  useEffect(() => {
    if (success || error) {
      return;
    }

    if (!token) {
      setError('Missing token!');

      return;
    }
    mutate({ token });
  }, [token, mutate, success, error]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonHref="/auth/signin"
      backButtonLabel="Back to login"
    >
      <div className="flex w-full items-center justify-center">
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
}
