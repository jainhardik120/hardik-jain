import { z } from 'zod';

import { DesignService, ExportService } from '@/canva-client';
import { getAccessTokenForUser, getUserClient } from '@/lib/canva';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import type { CanvaExportJob, PrismaClient } from '@prisma/client';
import { CanvaJobStatus } from '@prisma/client';
import { createId } from '@paralleldrive/cuid2';
import { ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { config } from '@/lib/aws-config';
import { env } from '@/env';
import type { Client } from '@hey-api/client-fetch';
import type { Session } from 'next-auth';

const canvaClientProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const client = await getClient(ctx.session.user.id, ctx.db);

  return next({
    ctx: {
      client: client,
    },
  });
});

const uploadCanvaImagesToS3 = async (
  updatedJob: CanvaExportJob,
  userId: string,
  db: PrismaClient,
) => {
  try {
    for (const url of updatedJob.urls) {
      const imageId = createId();
      const uploadedFile = await fetch(url);
      const fileBuffer = await uploadedFile.arrayBuffer();
      const contentType = uploadedFile.headers.get('Content-Type') ?? 'image/png';
      const extension = contentType.split('/')[1] ?? 'png';
      const fileName = `${userId}/${updatedJob.designId}/${imageId}.${extension}`;
      const client = new S3Client(config);
      await client.send(
        new PutObjectCommand({
          Bucket: env.S3_BUCKET_NAME_NEW,
          Key: `public/${fileName}`,
          Body: Buffer.from(fileBuffer),
          ContentType: contentType,
        }),
      );
    }
    await db.canvaExportJob.delete({
      where: { exportId: updatedJob.exportId },
    });
  } catch {}
};

const refreshJob = async (
  job: CanvaExportJob,
  client: Client,
  db: PrismaClient,
  session: Session,
) => {
  const result = await ExportService.getDesignExportJob({
    client: client,
    path: {
      exportId: job.exportId,
    },
  });
  if (result.error !== undefined || !result.data) {
    return;
  }
  switch (result.data.job.status) {
    case 'in_progress':
      break;
    case 'failed':
      await db.canvaExportJob.delete({
        where: {
          exportId: job.exportId,
        },
      });
      break;
    case 'success':
      const updatedJob = await db.canvaExportJob.update({
        where: {
          exportId: job.exportId,
        },
        data: {
          status: CanvaJobStatus.SUCCESS,
          urls: result.data.job.urls || [],
        },
      });
      await uploadCanvaImagesToS3(updatedJob, session.user.id, db);
      break;
  }

  return result.data;
};

export const canvaRouter = createTRPCRouter({
  getUserDesigns: canvaClientProcedure
    .input(
      z.object({
        continuation: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await DesignService.listDesigns({
        client: ctx.client,
        query: {
          ...(input.continuation !== undefined ? { continuation: input.continuation } : {}),
        },
      });
      if (result.error !== undefined || !result.data) {
        throw new TRPCError({
          message: result.error?.toString() ?? 'No data retreived',
          code: 'BAD_REQUEST',
        });
      }

      return result.data;
    }),
  listExports: canvaClientProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const jobsToRefreshStatus = await ctx.db.canvaExportJob.findMany({
      where: { designId: input, status: 'IN_PROGRESS' },
    });
    if (jobsToRefreshStatus.length > 0) {
      await Promise.all(
        jobsToRefreshStatus.map((job) => refreshJob(job, ctx.client, ctx.db, ctx.session)),
      );
    }
    const jobsToUploadToS3 = await ctx.db.canvaExportJob.findMany({
      where: { designId: input, status: 'SUCCESS' },
    });
    if (jobsToUploadToS3.length > 0) {
      await Promise.all(
        jobsToUploadToS3.map((job) => uploadCanvaImagesToS3(job, ctx.session.user.id, ctx.db)),
      );
    }
    const jobs = await ctx.db.canvaExportJob.findMany({
      where: { designId: input },
    });
    const client = new S3Client(config);
    const exportedImages =
      (
        await client.send(
          new ListObjectsV2Command({
            Bucket: env.S3_BUCKET_NAME_NEW,
            Prefix: `public/${ctx.session.user.id}/${input}/`,
          }),
        )
      ).Contents ?? [];
    return { jobs, exportedImages };
  }),
  exportDesign: canvaClientProcedure
    .input(
      z.object({
        designId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ExportService.createDesignExportJob({
        client: ctx.client,
        body: {
          design_id: input.designId,
          format: {
            type: 'jpg',
            quality: 100,
          },
        },
      });
      if (result.error !== undefined || !result.data) {
        throw new TRPCError({
          message: result.error?.toString() ?? 'No data retreived',
          code: 'BAD_REQUEST',
        });
      }
      const status: CanvaJobStatus = (() => {
        switch (result.data.job.status) {
          case 'in_progress':
            return CanvaJobStatus.IN_PROGRESS;
          case 'failed':
            return CanvaJobStatus.FAILED;
          case 'success':
            return CanvaJobStatus.SUCCESS;
        }
      })();
      if (status !== CanvaJobStatus.FAILED) {
        const exportJob = await ctx.db.canvaExportJob.create({
          data: {
            exportId: result.data.job.id,
            designId: input.designId,
            status: status,
          },
        });

        return exportJob;
      } else {
        throw new TRPCError({
          message: 'Export failed',
          code: 'BAD_REQUEST',
        });
      }
    }),
  createDesign: canvaClientProcedure
    .input(
      z.object({
        name: z.string().min(1),
        width: z.number().min(1),
        height: z.number().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await DesignService.createDesign({
        client: ctx.client,
        body: {
          design_type: {
            type: 'custom',
            width: input.width,
            height: input.height,
          },
          title: input.name,
        },
      });
      if (result.error !== undefined || !result.data) {
        throw new TRPCError({
          message: result.error?.toString() ?? 'No data retreived',
          code: 'BAD_REQUEST',
        });
      }

      return result.data;
    }),
  isCanvaClientConnected: protectedProcedure.query(async ({ ctx }) => {
    try {
      const token = await getAccessTokenForUser(ctx.session.user.id, ctx.db);
      return !!token;
    } catch {
      return false;
    }
  }),
  disconnectCanvaClient: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.canvaUserToken.deleteMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
});

const getClient = async (userId: string, db: PrismaClient) => {
  let token: string;
  try {
    token = await getAccessTokenForUser(userId, db);
  } catch (e) {
    throw new TRPCError({
      message: (e as Error).message,
      code: 'BAD_REQUEST',
    });
  }

  return getUserClient(token);
};
