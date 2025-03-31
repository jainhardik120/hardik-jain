import React from 'react';

import { Column as EmailColumn } from '@react-email/components';
import { z } from 'zod';

const ColumnPropsSchema = z.object({}).optional().default({});

export type ColumnProps = z.infer<typeof ColumnPropsSchema>;

export function Column({
  props,
  children,
}: {
  props: Partial<ColumnProps>;
  children: React.ReactNode;
}) {
  const parsedProps = ColumnPropsSchema.parse(props);

  return <EmailColumn {...parsedProps}>{children}</EmailColumn>;
}
