'use client';

import { api } from '@/server/api/react';
import React from 'react';
import Navbar from '@/components/site/site-header';

const ClientNavBar = () => {
  const session = api.auth.sessionDetails.useQuery();

  return <Navbar loading={session.isFetching} user={session.data?.user ?? null} />;
};

export default ClientNavBar;
