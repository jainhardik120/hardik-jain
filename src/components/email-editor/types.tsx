import { Heading, type HeadingProps } from './blocks/heading';
import { Section, type SectionProps } from './blocks/section';
import { Row, type RowProps } from './blocks/row';
import { Column, type ColumnProps } from './blocks/column';

export interface ComponentDefinition<TProps> {
  component: React.FC<{ props: TProps }>;
}

export interface Components {
  heading: ComponentDefinition<Partial<HeadingProps>>;
  section: ComponentDefinition<Partial<SectionProps>>;
  row: ComponentDefinition<Partial<RowProps>>;
  column: ComponentDefinition<Partial<ColumnProps>>;
}

export type ComponentType = keyof Components;

export const ComponentMap: {
  [K in ComponentType]: React.FC<{
    input: Components[K] extends ComponentDefinition<infer P> ? P : never;
    children?: React.ReactNode;
  }>;
} = {
  heading: ({ input }) => <Heading props={input} />,
  section: ({ input, children }) => <Section props={input}>{children}</Section>,
  row: ({ input, children }) => <Row props={input}>{children}</Row>,
  column: ({ input, children }) => <Column props={input}>{children}</Column>,
};

export interface LayoutItem<T extends ComponentType = ComponentType> {
  id: string;
  type: T;
  editDisabled: boolean;
  props: Components[T] extends ComponentDefinition<infer P> ? P : never;
  children?: LayoutItem[];
}

export type RootProps = {
  editDisabled: boolean;
};

export type Layout = { items: LayoutItem[]; props: RootProps };

export const defaultLayout: Layout = {
  items: [],
  props: {
    editDisabled: false,
  },
};
