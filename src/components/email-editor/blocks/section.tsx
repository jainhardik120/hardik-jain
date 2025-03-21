import { Section as EmailSection } from '@react-email/components';
import React from 'react';
import { z } from 'zod';

const SectionPropsSchema = z.object({}).optional().default({});

export type SectionProps = z.infer<typeof SectionPropsSchema>;

export function Section({
  props,
  children,
}: {
  props: Partial<SectionProps>;
  children: React.ReactNode;
}) {
  const parsedProps = SectionPropsSchema.parse(props);
  return <EmailSection {...parsedProps}>{children}</EmailSection>;
}
