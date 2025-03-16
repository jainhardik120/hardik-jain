'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { FieldError } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/server/api/react';
import { ContactMethods } from '@/types/constants';
import { ContactSchema } from '@/types/schemas';

type ContactForm = z.infer<typeof ContactSchema>;

const FormError: React.FC<{ error?: FieldError }> = ({ error }) => {
  if (!error) {
    return <></>;
  }
  return <span className="text-red-700">{error.message}</span>;
};

const ContactSection: React.FC = () => {
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(ContactSchema),
  });

  const mutation = api.contact.sendMessage.useMutation({
    onSuccess: () => {
      setIsLoading(false);
      setEmailSubmitted(true);
    },
    onError: () => {
      setIsLoading(false);
      setEmailSubmitted(false);
    },
  });

  const onSubmit = async (data: ContactForm) => {
    setEmailSubmitted(false);
    setIsLoading(true);
    await mutation.mutateAsync(data);
  };

  return (
    <section id="contact" className="profile-section">
      <div className="mx-auto container px-12 flex flex-col items-center flex-grow">
        <div className="my-auto flex flex-col gap-8">
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <div className="space-y-3 text-center mb-3">
              <h2>Get in Touch</h2>
              <p className="sm:text-lg mx-auto text-gray-500 dark:text-gray-400">
                Have a question or want to work together? Fill out the form or reach out on your
                preferred platform.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-4 w-full">
              {ContactMethods.map((contact, index) => {
                return (
                  <a
                    key={index}
                    href={contact.href}
                    target="_blank"
                    className="group flex flex-col items-center justify-center space-y-2 rounded-lg bg-gray-100 p-4 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <contact.icon className="h-8 w-8 text-gray-900 group-hover:text-gray-700 dark:text-gray-50 dark:group-hover:text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 group-hover:text-gray-700 dark:text-gray-50 dark:group-hover:text-gray-400">
                      {contact.label}
                    </span>
                  </a>
                );
              })}
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 items-center">
              <div className="space-y-2 w-full">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                  {...register('email')}
                />
                <FormError {...(errors.email ? { error: errors.email } : {})} />
              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Enter subject" {...register('subject')} />
                <FormError {...(errors.subject ? { error: errors.subject } : {})} />
              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your message"
                  {...register('message')}
                  className="min-h-[100px]"
                />
                <FormError {...(errors.message ? { error: errors.message } : {})} />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mx-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  'Send Message'
                )}
              </Button>
              {emailSubmitted && <span className="text-green-500">Email sent successfully!</span>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
