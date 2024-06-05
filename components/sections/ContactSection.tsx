"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons"
import { FieldError, useForm } from "react-hook-form";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type ContactForm = {
  email: string,
  subject: string,
  message: string
}

const ContactSchema: ZodType<ContactForm> = z.object({
  email: z.string().email("Enter a valid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(50, "Message should be minimum 50 characters long")
})

const FormError: React.FC<{ error?: FieldError }> = ({ error }) => {
  return (
    <>
      {error && (
        <>
          <span className="text-red-700">{error.message}</span>
        </>
      )}
    </>
  )
}

const contactMethods = [
  {
    href: "mailto:jainhardik120@gmail.com",
    label: "Mail",
    detail: "jainhardik120@gmail.com"
  },
  {
    href: "https://wa.me/7983121194",
    label: "Whatsapp",
    detail: "7983121194"
  },
  {
    href: "https://instagram.com/_.hardikj",
    label: "Instagram",
    detail: "@_.hardikj"
  }
];

const ContactSection: React.FC = () => {
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, setError } = useForm<ContactForm>({
    resolver: zodResolver(ContactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setEmailSubmitted(false);
    setIsLoading(true);
    const JSONdata = JSON.stringify(data);
    const endpoint = "/api/send";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    };
    const response = await fetch(endpoint, options);
    setIsLoading(false);
    if (response.ok) {
      console.log("Message sent.");
      setEmailSubmitted(true);
    }
  };

  return (
    <section id="contact" className="mx-auto px-12 py-20 flex flex-col items-center ">
      <h2 className="text-center text-4xl font-bold mt-4 mb-8 md:mb-12">
        Let&apos;s Connect
      </h2>
      <div className="flex flex-col justify-center mb-8">
        <p className="mb-4 max-w-sm md:max-w-md text-tsecondary-light dark:text-tsecondary-dark text-center">
          I&apos;m currently looking for new opportunities, my inbox is always
          open. Whether you have a question or just want to say hi, I&apos;ll
          try my best to get back to you!
        </p>
        <div className="socials flex flex-row gap-4 w-full justify-center">
          <a href="https://github.com/jainhardik120" aria-label="github" target="_blank" rel="noopener">
            <GitHubLogoIcon className="h-6 w-6" />
          </a>
          <a href="https://linkedin.com/in/jainhardik120" aria-label="linkedin" target="_blank" rel="noopener">
            <LinkedInLogoIcon className="h-6 w-6" />
          </a>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2  gap-8 ">
        <div className="flex flex-col md:justify-center w-[350px] gap-8">
          {contactMethods.map((method, index) => (
            <a
              key={index}
              href={method.href}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-border rounded-lg p-4 text-center"
            >
              <h3 className="text-lg font-semibold">{method.label}</h3>
              <span className="text-sm text-tsecondary-light dark:text-tsecondary-dark">{method.detail}</span>
            </a>
          ))}
        </div>
        <div>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="jacob@google.com"
                {...register("email")}
              />
              <FormError error={errors.email} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="subject">
                Subject
              </Label>
              <Input
                id="subject"
                type="text"
                placeholder="Just saying hi"
                {...register("subject")}
              />
              <FormError error={errors.subject} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="message">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Let's talk about..."
                {...register("message")}
              />
              <FormError error={errors.message} />
            </div>
            <Button type="submit" disabled={isLoading}>
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
                "Send Message"
              )}
            </Button>
            {emailSubmitted && (
              <span className="text-green-500">
                Email sent successfully!
              </span>
            )}
          </form>
        </div >
      </div >
    </section >
  );
};

export default ContactSection;