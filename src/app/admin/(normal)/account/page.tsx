import { notFound } from 'next/navigation';

import { api } from '@/server/api/server';

import AccountForm from './account-form';
import CanvaConnection from './canva-connection';

export default async function AccountPage() {
  const userDetails = await api.user.getUserDetails();
  if (!userDetails) {
    return notFound();
  }
  return (
    <div className="flex flex-col h-full w-full">
      <h2>Account Page</h2>
      <AccountForm
        userDetails={{
          ...userDetails,
          name: userDetails.name ?? '',
          image: userDetails.image ?? '',
          twitter: userDetails.twitter ?? '',
          linkedin: userDetails.linkedin ?? '',
          website: userDetails.website ?? '',
        }}
      />
      <CanvaConnection />
    </div>
  );
}
