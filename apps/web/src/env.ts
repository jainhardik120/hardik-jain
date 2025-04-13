import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    AUTH_SECRET: process.env.NODE_ENV === 'production' ? z.string() : z.string().optional(),
    AWS_REGION_NEW: z.string(),
    AWS_ACCESS_KEY_ID_NEW: z.string(),
    AWS_SECRET_ACCESS_KEY_NEW: z.string(),
    BASE_CANVA_CONNECT_API_URL: z.string(),
    CANVA_CLIENT_ID: z.string(),
    CANVA_CLIENT_SECRET: z.string(),
    DATABASE_URL: z.string().url(),
    EMAIL_SENDER_ADDRESS: z.string(),
    GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    S3_BUCKET_NAME_NEW: z.string(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    GOOGLE_OAUTH_CLIENT_ID: z.string(),
    GOOGLE_OAUTH_CLIENT_SECRET: z.string(),
  },
  client: {
    NEXT_PUBLIC_FILE_STORAGE_HOST: z.string().url(),
    NEXT_PUBLIC_BASE_URL: z.string().optional(),
    NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
    NEXT_PUBLIC_MILLION_LINT_ENABLED: z.enum(['true', 'false']).default('false'),
  },
  runtimeEnv: {
    AUTH_SECRET: process.env['AUTH_SECRET'],
    AWS_ACCESS_KEY_ID_NEW: process.env['AWS_ACCESS_KEY_ID_NEW'],
    AWS_REGION_NEW: process.env['AWS_REGION_NEW'],
    AWS_SECRET_ACCESS_KEY_NEW: process.env['AWS_SECRET_ACCESS_KEY_NEW'],
    BASE_CANVA_CONNECT_API_URL: process.env['BASE_CANVA_CONNECT_API_URL'],
    CANVA_CLIENT_ID: process.env['CANVA_CLIENT_ID'],
    CANVA_CLIENT_SECRET: process.env['CANVA_CLIENT_SECRET'],
    DATABASE_URL: process.env['DATABASE_URL'],
    EMAIL_SENDER_ADDRESS: process.env['EMAIL_SENDER_ADDRESS'],
    GOOGLE_GENERATIVE_AI_API_KEY: process.env['GOOGLE_GENERATIVE_AI_API_KEY'],
    NEXT_PUBLIC_FILE_STORAGE_HOST: process.env['NEXT_PUBLIC_FILE_STORAGE_HOST'],
    NEXT_PUBLIC_BASE_URL: process.env['NEXT_PUBLIC_BASE_URL'],
    NODE_ENV: process.env.NODE_ENV,
    S3_BUCKET_NAME_NEW: process.env['S3_BUCKET_NAME_NEW'],
    NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL:
      process.env['NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL'],
    NEXT_PUBLIC_MILLION_LINT_ENABLED: process.env['NEXT_PUBLIC_MILLION_LINT_ENABLED'],
    GITHUB_CLIENT_ID: process.env['GITHUB_CLIENT_ID'],
    GITHUB_CLIENT_SECRET: process.env['GITHUB_CLIENT_SECRET'],
    GOOGLE_OAUTH_CLIENT_ID: process.env['GOOGLE_OAUTH_CLIENT_ID'],
    GOOGLE_OAUTH_CLIENT_SECRET: process.env['GOOGLE_OAUTH_CLIENT_SECRET'],
  },
  skipValidation:
    process.env['SKIP_ENV_VALIDATION'] !== undefined &&
    process.env['SKIP_ENV_VALIDATION'] === 'true',
  emptyStringAsUndefined: true,
});
