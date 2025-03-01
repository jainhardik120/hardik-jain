import { z } from 'zod';

import { DesignService, ExportService } from '@/canva-client';
import { getAccessTokenForUser, getUserClient } from '@/lib/canva';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '@prisma/client';
import { CanvaJobStatus, ImageType } from '@prisma/client';
import { createId } from '@paralleldrive/cuid2';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { config } from '@/lib/aws-config';
import { env } from '@/env';

const canvaClientProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const client = await getClient(ctx.session.user.id, ctx.db);

  return next({
    ctx: {
      client: client,
    },
  });
});

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
  listExports: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const jobs = await ctx.db.canvaExportJob.findMany({
      where: { designId: input },
    });
    const exportedImages = await ctx.db.exportedImages.findMany({
      where: { sourceId: input, imageType: ImageType.CANVA },
    });
    return { jobs, exportedImages };
  }),
  refreshExportStatus: canvaClientProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const result = await ExportService.getDesignExportJob({
      client: ctx.client,
      path: {
        exportId: input,
      },
    });
    if (result.error !== undefined || !result.data) {
      throw new TRPCError({
        message: result.error?.toString() ?? 'No data retreived',
        code: 'BAD_REQUEST',
      });
    }
    switch (result.data.job.status) {
      case 'in_progress':
        break;
      case 'failed':
        await ctx.db.canvaExportJob.delete({
          where: {
            exportId: input,
          },
        });
        throw new TRPCError({
          message: result.data.job.error?.message ?? 'Export failed',
          code: 'BAD_REQUEST',
        });
      case 'success':
        const updatedJob = await ctx.db.canvaExportJob.update({
          where: {
            exportId: input,
          },
          data: {
            status: CanvaJobStatus.SUCCESS,
            urls: result.data.job.urls || [],
          },
        });
        try {
          for (const url of result.data.job.urls || []) {
            const imageId = createId();
            const uploadedFile = await fetch(url);
            const fileBuffer = await uploadedFile.arrayBuffer();
            const contentType = uploadedFile.headers.get('Content-Type') ?? 'image/png';
            const extension = contentType.split('/')[1] ?? 'png';
            const fileName = `${ctx.session.user.id}/${updatedJob.designId}/${imageId}.${extension}`;
            const client = new S3Client(config);
            await client.send(
              new PutObjectCommand({
                Bucket: env.S3_BUCKET_NAME_NEW,
                Key: `public/${fileName}`,
                Body: Buffer.from(fileBuffer),
                ContentType: contentType,
              }),
            );
            const s3Url = `${env.NEXT_PUBLIC_FILE_STORAGE_HOST}/${fileName}`;
            await ctx.db.exportedImages.create({
              data: {
                id: imageId,
                sourceId: updatedJob.designId,
                imageType: ImageType.CANVA,
                path: s3Url,
              },
            });
          }
          await ctx.db.canvaExportJob.delete({
            where: { exportId: input },
          });
        } catch {}
        break;
    }

    return result.data;
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
