import DesignList from '@/components/canva/list-designs';
import { api } from '@/server/api/server';
import React from 'react';

export default async function CanvaDesigns() {
  const isClientConnected = await api.canva.isCanvaClientConnected();
  if (!isClientConnected) {
    return <div>Please connect Canva client</div>;
  }
  const initialData = await api.canva.getUserDesigns({});

  return <DesignList initialData={initialData} />;
}
