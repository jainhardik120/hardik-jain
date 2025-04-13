import { env } from '@/env';

export const config = {
  region: env.AWS_REGION_NEW,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID_NEW,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY_NEW,
  },
};
