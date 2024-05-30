"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GitHubLogoIcon, LinkedInLogoIcon, InstagramLogoIcon, TwitterLogoIcon, DownloadIcon } from "@radix-ui/react-icons"

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
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      email,
      subject,
      message,
    };
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
    if (response.status === 200) {
      console.log("Message sent.");
      setEmailSubmitted(true);
    }
  };

  return (
    <section id="contact" className="px-4">
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
            <GitHubLogoIcon className="h-6 w-6"/>
          </a>
          <a href="https://linkedin.com/in/jainhardik120" aria-label="linkedin" target="_blank" rel="noopener">
            <LinkedInLogoIcon className="h-6 w-6"/>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2  gap-8 ">
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
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                placeholder="jacob@google.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="subject">
                Subject
              </Label>
              <Input
                id="subject"
                name="subject"
                type="text"
                value={subject}
                placeholder="Just saying hi"
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="message">
                Message
              </Label>
              <Textarea
                id="message"
                name="message"
                value={message}
                placeholder="Let's talk about..."
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <Button type="submit">Send Message</Button>
            {emailSubmitted && (
              <p className="text-sm mt-2">
                Email sent successfully!
              </p>
            )}
          </form>
        </div >
      </div >
    </section >
  );
};

export default ContactSection;