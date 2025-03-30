import { z } from 'zod';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { config } from '@/lib/aws-config';
import { getBaseUrl } from '@/lib/getBaseUrl';
import { env } from '@/env';

const client = new S3Client(config);

export const sharesRouter = createTRPCRouter({
  createShare: publicProcedure
    .input(
      z.object({
        fileKey: z.string(),
        expiresIn: z.number().min(1000), // Minimum 1 second
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { fileKey, expiresIn } = input;

      // Calculate expiration date
      const expiresAt = new Date(Date.now() + expiresIn);

      // Create a share record in the database
      const share = await ctx.db.fileShare.create({
        data: {
          fileKey,
          expiresAt,
        },
      });
      const shareId = share.id;
      // Generate the share URL
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

      // Find all active shares for this file
      const shares = await ctx.db.fileShare.findMany({
        where: {
          fileKey,
          expiresAt: {
            gt: new Date(), // Only return non-expired shares
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

      // Find the share
      const share = await ctx.db.fileShare.findUnique({
        where: {
          id: shareId,
        },
      });

      if (!share) {
        throw new Error('Share not found');
      }

      // Check if the share has expired
      if (share.expiresAt < new Date()) {
        throw new Error('Share has expired');
      }

      // Generate a signed URL for the file
      const command = new GetObjectCommand({
        Bucket: env.S3_BUCKET_NAME_NEW,
        Key: share.fileKey,
      });

      const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });

      // Extract the filename from the key
      const fileName = share.fileKey.split('/').pop() ?? 'file';

      return {
        ...share,
        signedUrl,
        fileName,
      };
    }),
});
