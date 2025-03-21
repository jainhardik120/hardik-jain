import { Row as EmailRow } from '@react-email/components';
import React from 'react';
import { z } from 'zod';

const RowPropsSchema = z.object({}).optional().default({});

export type RowProps = z.infer<typeof RowPropsSchema>;

export function Row({ props, children }: { props: Partial<RowProps>; children: React.ReactNode }) {
  const parsedProps = RowPropsSchema.parse(props);

  return <EmailRow {...parsedProps}>{children}</EmailRow>;
}
