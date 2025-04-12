'use client';

import { useSearchParams } from 'next/navigation';

import { signIn } from 'next-auth/react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { Button } from '@/components/ui/button';

export function Social() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl');

  const onClick = (provider: 'google' | 'github') => {
    void signIn(provider, { callbackUrl: callbackUrl ?? '/' });
  };

  return (
    <div className="flex w-full items-center gap-x-2">
      <Button size="lg" className="w-full" variant="outline" onClick={() => onClick('google')}>
        <FcGoogle />
      </Button>
      <Button size="lg" className="w-full" variant="outline" onClick={() => onClick('github')}>
        <FaGithub />
      </Button>
    </div>
  );
}
