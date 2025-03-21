import { Heading as EmailHeading } from '@react-email/components';
import { z } from 'zod';

const HeadingPropsSchema = z
  .object({
    text: z.string().optional().default('Heading'),
    as: z.enum(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).optional().default('h1'),
    m: z.string().optional().default('0'),
    mb: z.string().optional().default('0'),
    mt: z.string().optional().default('0'),
    ml: z.string().optional().default('0'),
    mr: z.string().optional().default('0'),
    mx: z.string().optional().default('0'),
    my: z.string().optional().default('0'),
  })
  .optional()
  .default({});

export type HeadingProps = z.infer<typeof HeadingPropsSchema>;

export function Heading({ props }: { props: Partial<HeadingProps> }) {
  const parsedProps = HeadingPropsSchema.parse(props);
  return <EmailHeading {...parsedProps}>{parsedProps.text}</EmailHeading>;
}
