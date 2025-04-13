'use client';

import React, { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Badge } from '@repo/ui/badge';
import { Button } from '@repo/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/form';
import { Input } from '@repo/ui/input';
import { Textarea } from '@repo/ui/textarea';
import { X } from 'lucide-react';
import {
  type ControllerRenderProps,
  type Path,
  useForm,
  type UseFormReturn,
} from 'react-hook-form';
import { type z } from 'zod';

import ImageUpload from '@/components/ImageUpload';

type InputType =
  | 'input'
  | 'textarea'
  | 'custom'
  | 'password'
  | 'stringArray'
  | 'image'
  | 'number'
  | 'email'
  | 'date'
  | 'time'
  | 'tel'
  | 'url'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'color';

type SelectOption = { label: string; value: string | number };

type FormField<T extends z.ZodTypeAny> = {
  name: Path<z.infer<T>>;
  label: string;
  type: InputType;
  placeholder?: string;
  description?: string;
  options?: SelectOption[];
  min?: number;
  max?: number;
  step?: number;
  render?: (field: ControllerRenderProps<z.infer<T>, Path<z.infer<T>>>) => React.ReactNode;
};

type Props<T extends z.ZodTypeAny> = {
  schema: T;
  onSubmit: (values: z.infer<T>) => Promise<void>;
  defaultValues: z.infer<T>;
  fields: Array<FormField<T>>;
  submitButtonText?: string;
  submitButtonDisabled?: boolean;
  FormFooter?: ({ form }: { form: UseFormReturn<z.infer<T>> }) => React.ReactNode;
  onValuesChange?: (values: z.infer<T>) => void;
  showSubmitButton: boolean;
  ref?: React.Ref<UseFormReturn<z.infer<T>>>;
};

function StringArrayInput<T extends z.ZodTypeAny>({
  field,
}: {
  field: ControllerRenderProps<z.TypeOf<T>, Path<z.TypeOf<T>>>;
}) {
  const [value, setValue] = useState<string>('');

  if (!Array.isArray(field.value)) {
    field.onChange([]);
  }
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();

      if (value.trim()) {
        const newValue = [...field.value, value.trim()];
        field.onChange(newValue);
        setValue('');
      }
    }
  };

  const handleBlur = () => {
    if (value.trim()) {
      const newValue = [...field.value, value.trim()];
      field.onChange(newValue);
      setValue('');
    }
    field.onBlur();
  };

  const handleRemoveItem = (index: number) => {
    const newValue = [...field.value];
    newValue.splice(index, 1);
    field.onChange(newValue);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const values = pasteData
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (values.length) {
      const newValue = [...field.value, ...values];
      field.onChange(newValue);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {(field.value as string[])?.map((item: string, index: number) => (
          <Badge key={index} variant="secondary" className="px-2 py-1">
            {item}
            <button
              title="Remove"
              type="button"
              onClick={() => handleRemoveItem(index)}
              className="ml-2 text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        placeholder="Type and press Enter or comma to add"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onKeyDown={handleInputKeyDown}
        onBlur={handleBlur}
        onPaste={handlePaste}
      />
    </>
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
}) {
  switch (type) {
    case 'input':
      return <Input placeholder={formField.placeholder} {...field} />;
    case 'password':
      return <Input type="password" placeholder={formField.placeholder} {...field} />;
    case 'textarea':
      return <Textarea placeholder={formField.placeholder} {...field} />;
    case 'email':
      return <Input type="email" placeholder={formField.placeholder} {...field} />;
    case 'number':
      return (
        <Input
          type="number"
          placeholder={formField.placeholder}
          min={formField.min}
          max={formField.max}
          step={formField.step}
          {...field}
        />
      );
    case 'date':
      return <Input type="date" placeholder={formField.placeholder} {...field} />;
    case 'time':
      return <Input type="time" placeholder={formField.placeholder} {...field} />;
    case 'tel':
      return <Input type="tel" placeholder={formField.placeholder} {...field} />;
    case 'url':
      return <Input type="url" placeholder={formField.placeholder} {...field} />;
    case 'checkbox':
      return (
        <Input
          type="checkbox"
          checked={field.value as boolean}
          onChange={(e) => field.onChange(e.target.checked)}
        />
      );
    case 'color':
      return <Input type="color" {...field} />;
    case 'select':
      return (
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          {...field}
        >
          {formField.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    case 'radio':
      return (
        <div className="flex flex-col gap-2">
          {formField.options?.map((option) => (
            <label key={option.value} className="flex items-center gap-2">
              <Input
                type="radio"
                value={option.value}
                checked={field.value === option.value}
                onChange={(e) => field.onChange(e.target.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      );
    case 'custom':
      return formField.render !== undefined ? formField.render(field) : <></>;
    case 'stringArray':
      return <StringArrayInput field={field} />;
    case 'image':
      return <ImageUpload imageUrl={field.value as string} setImageUrl={field.onChange} />;
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

  if (props.ref !== undefined && props.ref !== null) {
    if (typeof props.ref === 'function') {
      props.ref(form);
    } else {
      props.ref.current = form;
    }
  }

  useEffect(() => {
    const subscription = form.watch((values) => {
      if (values !== undefined && props.onValuesChange !== undefined) {
        props.onValuesChange(values);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, props.onValuesChange]);

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
        {props.FormFooter !== undefined ? <props.FormFooter form={form} /> : <></>}
        {props.showSubmitButton === true && (
          <Button disabled={props.submitButtonDisabled} type="submit">
            {props.submitButtonText ?? 'Submit'}
          </Button>
        )}
      </form>
    </Form>
  );
}

export default RenderedForm;
