import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { z } from 'zod';

import { env } from '@/env';
import { config } from '@/lib/aws-config';
import { getBaseUrl } from '@/lib/getBaseUrl';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

const client = new S3Client(config);

export const sharesRouter = createTRPCRouter({
  createShare: publicProcedure
    .input(
      z.object({
        fileKey: z.string(),
        expiresIn: z.number().min(1000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { fileKey, expiresIn } = input;

      const expiresAt = new Date(Date.now() + expiresIn);

      const share = await ctx.db.fileShare.create({
        data: {
          fileKey,
          expiresAt,
        },
      });
      const shareId = share.id;
      const shareUrl = `${getBaseUrl()}/share/${shareId}`;

      return {
        shareId,
        shareUrl,
        expiresAt,
      };
    }),

  getSharesByFile: publicProcedure
    .input(
      z.object({
        fileKey: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { fileKey } = input;

      const shares = await ctx.db.fileShare.findMany({
        where: {
          fileKey,
          expiresAt: {
            gt: new Date(),
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return shares.map((share) => ({
        ...share,
        shareUrl: `${getBaseUrl()}/share/${share.id}`,
      }));
    }),

  getShareById: publicProcedure
    .input(
      z.object({
        shareId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { shareId } = input;

      const share = await ctx.db.fileShare.findUnique({
        where: {
          id: shareId,
        },
      });

      if (!share) {
        throw new Error('Share not found');
      }

      if (share.expiresAt < new Date()) {
        throw new Error('Share has expired');
      }

      const command = new GetObjectCommand({
        Bucket: env.S3_BUCKET_NAME_NEW,
        Key: share.fileKey,
      });

      const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });

      const fileName = share.fileKey.split('/').pop() ?? 'file';

      return {
        ...share,
        signedUrl,
        fileName,
      };
    }),
});
