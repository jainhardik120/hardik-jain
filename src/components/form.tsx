import React, { useCallback, useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { type ControllerRenderProps, type Path, useForm } from 'react-hook-form';
import { type z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type InputType = 'input' | 'textarea' | 'custom' | 'password' | 'stringArray';

type FormField<T extends z.ZodTypeAny> = {
  name: Path<z.infer<T>>;
  label: string;
  type: InputType;
  placeholder?: string;
  description?: string;
  render?: (field: ControllerRenderProps<z.infer<T>, Path<z.infer<T>>>) => JSX.Element;
};

type Props<T extends z.ZodTypeAny> = {
  schema: T;
  onSubmit: (values: z.infer<T>) => Promise<void>;
  defaultValues: z.infer<T>;
  fields: Array<FormField<T>>;
  submitButtonText?: string;
  submitButtonDisabled?: boolean;
  FormFooter?: () => JSX.Element;
};

function StringArrayInput<T extends z.ZodTypeAny>({
  field,
}: {
  field: ControllerRenderProps<z.TypeOf<T>, Path<z.TypeOf<T>>>;
}) {
  const [value, setValue] = useState<string>((field.value as string[]).join(', '));

  const updateFieldValue = useCallback((value: string) => {
    field.onChange(value.split(',').map((item) => item.trim()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateFieldValue(value);
  }, [value, updateFieldValue]);

  return (
    <Textarea
      placeholder="Enter tech stack (comma separated)"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
    />
  );
}

function RenderFormInput<T extends z.ZodTypeAny>({
  type,
  field,
  formField,
}: {
  type: InputType;
  field: ControllerRenderProps<z.TypeOf<T>, Path<z.TypeOf<T>>>;
  formField: FormField<T>;
}): JSX.Element {
  switch (type) {
    case 'input':
      return <Input placeholder={formField.placeholder} {...field} />;
    case 'password':
      return <Input type="password" placeholder={formField.placeholder} {...field} />;
    case 'textarea':
      return <Textarea placeholder={formField.placeholder} {...field} />;
    case 'custom':
      return formField.render !== undefined ? formField.render(field) : <></>;
    case 'stringArray':
      return <StringArrayInput field={field} />;
    default:
      return <></>;
  }
}

function RenderedForm<T extends z.ZodTypeAny>(props: Props<T>) {
  type FormData = z.infer<T>;

  const form = useForm<FormData>({
    resolver: zodResolver(props.schema),
    defaultValues: props.defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmit)} className="grid gap-4">
        {props.fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <RenderFormInput type={field.type} field={formField} formField={field} />
                </FormControl>
                {field.description !== null && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        {props.FormFooter !== undefined ? <props.FormFooter /> : <></>}
        <Button disabled={props.submitButtonDisabled} type="submit">
          {props.submitButtonText ?? 'Submit'}
        </Button>
      </form>
    </Form>
  );
}

export default RenderedForm;
