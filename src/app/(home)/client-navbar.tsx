'use client';

import React from 'react';

import Navbar from '@/components/site/site-header';
import { api } from '@/server/api/react';

const ClientNavBar = () => {
  const session = api.auth.sessionDetails.useQuery();

  return <Navbar loading={session.isFetching} user={session.data?.user ?? null} />;
};

export default ClientNavBar;
