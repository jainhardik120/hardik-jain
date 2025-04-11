import { z } from 'zod';

export const titlesSchema = z.object({
  title: z.string().describe('Article title'),
  keywordResearch: z.object({
    searchVolume: z.string().describe('Estimated monthly search volume'),
    competitionLevel: z.string().describe('Low/medium/high competition level'),
  }),
  outline: z.object({
    subheadings: z.array(z.string()).describe('Subheadings'),
    keyPoints: z.array(z.string()).describe('Key points'),
  }),
});
