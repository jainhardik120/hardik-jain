'use client';

import { api } from '@/server/api/react';
import React from 'react';
import Navbar from '@/components/sidebar/site-header';

const ClientNavBar = () => {
  const session = api.auth.sessionDetails.useQuery();
  return <Navbar session={session.data ?? null} />;
};

export default ClientNavBar;
