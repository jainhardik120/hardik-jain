import type { NextRequest } from 'next/server';

import { handlers } from '@/server/auth';

async function apiHandler(req: NextRequest) {
  let response: Response;
  if (req.method === 'GET') {
    response = await handlers.GET(req);
  } else if (req.method === 'POST') {
    response = await handlers.POST(req);
  } else {
    return;
  }

  return response;
}

export { apiHandler as GET, apiHandler as POST };
