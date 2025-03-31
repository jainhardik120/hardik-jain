import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { z } from 'zod';

import { type Layout, defaultLayout } from '@/components/email-editor/types';
import { env } from '@/env';
import { config } from '@/lib/aws-config';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

export const EmailRouter = createTRPCRouter({
  createNewEmailTemplate: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const newEmailTemplate = await ctx.db.emailTemplate.create({
      data: {
        creatorId: ctx.session.user.id,
        title: input,
      },
    });
    const s3Client = new S3Client(config);
    const bucketName = env.S3_BUCKET_NAME_NEW;
    const baseKey = `email_templates/${newEmailTemplate.id}`;
    const params = {
      Bucket: bucketName,
      Key: `${baseKey}.json`,
      Body: JSON.stringify(defaultLayout),
    };
    await s3Client.send(new PutObjectCommand(params));
    return newEmailTemplate.id;
  }),
  getEmailTemplate: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const emailTemplate = await ctx.db.emailTemplate.findFirst({
      where: {
        id: input,
      },
    });
    if (!emailTemplate) {
      throw new Error('Email template not found');
    }
    const s3Client = new S3Client(config);
    const bucketName = env.S3_BUCKET_NAME_NEW;
    const baseKey = `email_templates/${emailTemplate.id}`;
    const params = {
      Bucket: bucketName,
      Key: `${baseKey}.json`,
    };
    const contents = await s3Client.send(new GetObjectCommand(params));
    const body = await contents.Body?.transformToString();
    const layout: Layout = JSON.parse(body ?? JSON.stringify(defaultLayout)) as Layout;
    return {
      emailTemplate,
      layout,
    };
  }),
  listEmailTemplates: protectedProcedure.query(async ({ ctx }) => {
    const emailTemplates = await ctx.db.emailTemplate.findMany();

    return emailTemplates;
  }),
  updateEmailTemplate: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        layout: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const emailTemplate = await ctx.db.emailTemplate.findFirst({
        where: {
          id: input.id,
        },
      });
      if (!emailTemplate) {
        throw new Error('Email template not found');
      }
      const s3Client = new S3Client(config);
      const bucketName = env.S3_BUCKET_NAME_NEW;
      const baseKey = `email_templates/${emailTemplate.id}`;
      const params = {
        Bucket: bucketName,
        Key: `${baseKey}.json`,
        Body: input.layout,
      };
      await s3Client.send(new PutObjectCommand(params));

      if (input.title !== emailTemplate.title) {
        await ctx.db.emailTemplate.update({
          where: {
            id: input.id,
          },
          data: {
            title: input.title,
          },
        });
      }
      return emailTemplate.id;
    }),
});
