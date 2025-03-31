import {
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  CopyObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { z } from 'zod';

import { env } from '@/env';
import { config } from '@/lib/aws-config';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

import type { _Object } from '@aws-sdk/client-s3';

const client = new S3Client(config);

export const filesRouter = createTRPCRouter({
  signedUrlForPut: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        filetype: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const params = {
        Bucket: env.S3_BUCKET_NAME_NEW,
        Key: `public/${ctx.session.user.id}/${input.filename}`,
        ContentType: input.filetype,
      };
      const command = new PutObjectCommand(params);
      const url = await getSignedUrl(client, command);

      return url;
    }),
  listUserUploadedFiles: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const path = `public/${ctx.session.user.id}${input.length !== 0 ? '/' : ''}${input}/`;

    const params = {
      Bucket: env.S3_BUCKET_NAME_NEW,
      Prefix: path,
    };
    const data = await client.send(new ListObjectsV2Command(params));
    const contents: _Object[] = data.Contents ?? [];
    return contents;
  }),

  list: protectedProcedure
    .input(
      z.object({
        prefix: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { prefix } = input;

      const command = new ListObjectsV2Command({
        Bucket: env.S3_BUCKET_NAME_NEW,
        Prefix: prefix,
        Delimiter: '/',
      });

      const response = await client.send(command);

      const folders = (response.CommonPrefixes || []).map((prefix) => ({
        key: prefix.Prefix ?? '',
        size: 0,
        lastModified: new Date(),
        isFolder: true,
      }));

      const files = (response.Contents || [])
        .filter((item) => item.Key !== prefix)
        .map((item) => ({
          key: item.Key ?? '',
          size: item.Size ?? 0,
          lastModified: item.LastModified ?? new Date(),
          isFolder: false,
        }));

      return [...folders, ...files].sort((a, b) => {
        if (a.isFolder && !b.isFolder) {
          return -1;
        }
        if (!a.isFolder && b.isFolder) {
          return 1;
        }

        return a.key.localeCompare(b.key);
      });
    }),

  getUploadUrl: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        contentType: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { fileName, contentType } = input;

      const command = new PutObjectCommand({
        Bucket: env.S3_BUCKET_NAME_NEW,
        Key: fileName,
        ContentType: contentType,
      });

      const url = await getSignedUrl(client, command, { expiresIn: 3600 });

      return {
        url,
        fields: {},
      };
    }),

  getDownloadUrl: protectedProcedure
    .input(
      z.object({
        key: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { key } = input;

      const command = new PutObjectCommand({
        Bucket: env.S3_BUCKET_NAME_NEW,
        Key: key,
      });

      const url = await getSignedUrl(client, command, { expiresIn: 3600 });

      return { url };
    }),

  createFolder: protectedProcedure
    .input(
      z.object({
        path: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { path } = input;

      const folderPath = path.endsWith('/') ? path : `${path}/`;

      const command = new PutObjectCommand({
        Bucket: env.S3_BUCKET_NAME_NEW,
        Key: folderPath,
        Body: '',
      });

      await client.send(command);

      return { success: true };
    }),

  rename: protectedProcedure
    .input(
      z.object({
        oldKey: z.string(),
        newKey: z.string(),
        isFolder: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      const { oldKey, newKey, isFolder } = input;

      if (isFolder) {
        const listCommand = new ListObjectsV2Command({
          Bucket: env.S3_BUCKET_NAME_NEW,
          Prefix: oldKey,
        });

        const response = await client.send(listCommand);

        if (!response.Contents || response.Contents.length === 0) {
          throw new Error('Folder not found');
        }

        for (const item of response.Contents) {
          if (item.Key === undefined) {
            continue;
          }

          const objectKey = item.Key;
          const newObjectKey = objectKey.replace(oldKey, newKey);

          const copyCommand = new CopyObjectCommand({
            Bucket: env.S3_BUCKET_NAME_NEW,
            CopySource: `${env.S3_BUCKET_NAME_NEW}/${objectKey}`,
            Key: newObjectKey,
          });

          await client.send(copyCommand);

          const deleteCommand = new DeleteObjectCommand({
            Bucket: env.S3_BUCKET_NAME_NEW,
            Key: objectKey,
          });

          await client.send(deleteCommand);
        }
      } else {
        const copyCommand = new CopyObjectCommand({
          Bucket: env.S3_BUCKET_NAME_NEW,
          CopySource: `${env.S3_BUCKET_NAME_NEW}/${oldKey}`,
          Key: newKey,
        });

        await client.send(copyCommand);

        const deleteCommand = new DeleteObjectCommand({
          Bucket: env.S3_BUCKET_NAME_NEW,
          Key: oldKey,
        });

        await client.send(deleteCommand);
      }

      return { success: true };
    }),

  delete: protectedProcedure
    .input(
      z.object({
        key: z.string(),
        isFolder: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      const { key, isFolder } = input;

      if (isFolder) {
        const listCommand = new ListObjectsV2Command({
          Bucket: env.S3_BUCKET_NAME_NEW,
          Prefix: key,
        });

        const response = await client.send(listCommand);

        if (!response.Contents || response.Contents.length === 0) {
          return { success: true };
        }

        const objects = response.Contents.map((item) => ({ Key: item.Key ?? '' }));

        const deleteCommand = new DeleteObjectsCommand({
          Bucket: env.S3_BUCKET_NAME_NEW,
          Delete: { Objects: objects },
        });

        await client.send(deleteCommand);
      } else {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: env.S3_BUCKET_NAME_NEW,
          Key: key,
        });

        await client.send(deleteCommand);
      }

      return { success: true };
    }),
});
