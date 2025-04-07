import { FaExclamationTriangle } from 'react-icons/fa';

import { CardWrapper } from '@/components/auth/card-wrapper';

import { NewVerificationForm } from './new-verification';

export default async function AuthPage({ params }: { params: Promise<{ path: string[] }> }) {
  const path = (await params).path[0];
  const headerMessage = ((): { headerMessage: string; body: React.ReactNode } => {
    switch (path) {
      case 'new-verification':
        return {
          headerMessage: 'Confirming your verification',
          body: <NewVerificationForm />,
        };
      case 'verify-request':
        return {
          headerMessage: 'Check your email',
          body: <p>A sign in link has been sent to your email address</p>,
        };
      case undefined:
      default:
        return {
          headerMessage: 'Oops! Something went wrong',
          body: <FaExclamationTriangle className="text-destructive w-16 h-16" />,
        };
    }
  })();
  return (
    <CardWrapper
      backButtonLabel="Back to login"
      backButtonHref="/auth/signin"
      headerLabel={headerMessage.headerMessage}
    >
      <div className="flex w-full items-center justify-center">{headerMessage.body}</div>
    </CardWrapper>
  );
}
