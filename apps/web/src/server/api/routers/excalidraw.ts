import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { z } from 'zod';

import { config } from '@/config/aws-config';
import { env } from '@/env';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';

export const excalidrawRouter = createTRPCRouter({
  listDesigns: protectedProcedure.query(async ({ ctx }) => {
    const designs = await ctx.db.excalidrawDiagrams.findMany({
      where: { creatorId: ctx.session.user.id },
    });

    return designs;
  }),
  createDesign: protectedProcedure.mutation(async ({ ctx }) => {
    const newDesign = await ctx.db.excalidrawDiagrams.create({
      data: {
        lastModified: new Date(Date.now()),
        creatorId: ctx.session.user.id,
      },
    });
    const s3Client = new S3Client(config);
    const bucketName = env.S3_BUCKET_NAME_NEW;
    const baseKey = `excalidraw_diagrams/${newDesign.id}`;
    const elementsParams = {
      Bucket: bucketName,
      Key: `${baseKey}_elements.json`,
      Body: JSON.stringify({
        elements: [],
      }),
    };
    const filesParams = {
      Bucket: bucketName,
      Key: `${baseKey}_files.json`,
      Body: JSON.stringify({
        files: {},
      }),
    };
    await Promise.all([
      s3Client.send(new PutObjectCommand(elementsParams)),
      s3Client.send(new PutObjectCommand(filesParams)),
    ]);

    return newDesign.id;
  }),
  getSignedUrlDesign: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const diagram = await ctx.db.excalidrawDiagrams.findUnique({
        where: { id: input.id, creatorId: ctx.session.user.id },
      });
      if (!diagram) {
        throw new Error('Design not found');
      }
      const client = new S3Client(config);
      const bucketName = env.S3_BUCKET_NAME_NEW;
      const baseKey = `excalidraw_diagrams/${input.id}`;
      const elementsParams = {
        Bucket: bucketName,
        Key: `${baseKey}_elements.json`,
      };
      const filesParams = {
        Bucket: bucketName,
        Key: `${baseKey}_files.json`,
      };
      const elementsUrl = await getSignedUrl(client, new GetObjectCommand(elementsParams));
      const filesUrl = await getSignedUrl(client, new GetObjectCommand(filesParams));

      return {
        elementsUrl,
        filesUrl,
      };
    }),
  getSignedUrlForPutFiles: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const diagram = await ctx.db.excalidrawDiagrams.findUnique({
        where: { id: input.id, creatorId: ctx.session.user.id },
      });
      if (!diagram) {
        throw new Error('Design not found');
      }
      const client = new S3Client(config);
      const bucketName = env.S3_BUCKET_NAME_NEW;
      const key = `excalidraw_diagrams/${input.id}_files.json`;

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: 'application/json',
      });

      const signedUrl = await getSignedUrl(client, command, {
        expiresIn: 3600,
      });

      return signedUrl;
    }),
  updateElements: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        elements: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const diagram = await ctx.db.excalidrawDiagrams.findUnique({
        where: { id: input.id, creatorId: ctx.session.user.id },
      });
      if (!diagram) {
        throw new Error('Design not found');
      }
      const client = new S3Client(config);
      const bucketName = env.S3_BUCKET_NAME_NEW;
      const key = `excalidraw_diagrams/${input.id}_elements.json`;

      try {
        JSON.parse(input.elements);

        const command = new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: JSON.stringify({ elements: JSON.parse(input.elements) as ExcalidrawElement[] }),
          ContentType: 'application/json',
        });

        await client.send(command);
        await ctx.db.excalidrawDiagrams.update({
          where: { id: input.id, creatorId: ctx.session.user.id },
          data: {
            lastModified: new Date(Date.now()),
          },
        });
        return { success: true };
      } catch {
        throw new Error('Failed to update elements. Ensure the input is valid JSON.');
      }
    }),
});
