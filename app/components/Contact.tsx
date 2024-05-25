"use client";

import React, { useState } from "react";
import GithubIcon from "../../public/github-icon.svg";
import LinkedinIcon from "../../public/linkedin-icon.svg";
import Image from "next/image";
import TextInput from "./TextInput";
import TextareaInput from "./TextareaInput";

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
    <section id="contact">
      <h2 className="text-center text-4xl font-bold mt-4 mb-8 md:mb-12">
        Let&apos;s Connect
      </h2>
      <div className="grid md:grid-cols-2 gap-12 relative">
        <div className="flex flex-col md:justify-center">
          <p className="mb-4 max-w-md text-tsecondary-light dark:text-tsecondary-dark text-center md:text-left">
            I&apos;m currently looking for new opportunities, my inbox is always
            open. Whether you have a question or just want to say hi, I&apos;ll
            try my best to get back to you!
          </p>
          <div className="socials flex flex-row gap-2 w-full justify-center">
            <a href="https://github.com/jainhardik120" aria-label="github" target="_blank" rel="noopener">
              <Image src={GithubIcon} alt="Github Icon" className="filter invert dark:invert-0" />
            </a>
            <a href="https://linkedin.com/in/jainhardik120" aria-label="linkedin" target="_blank" rel="noopener">
              <Image src={LinkedinIcon} alt="Linkedin Icon" className="filter invert dark:invert-0" />
            </a>
          </div>
        </div>
        <div>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <TextInput
              label="Your email"
              name="email"
              type="email"
              value={email}
              placeholder="jacob@google.com"
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextInput
              label="Subject"
              name="subject"
              type="text"
              value={subject}
              placeholder="Just saying hi"
              onChange={(e) => setSubject(e.target.value)}
            />
            <TextareaInput
              label="Message"
              name="message"
              value={message}
              placeholder="Let's talk about..."
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="submit"
              className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2.5 px-5 rounded-lg w-full"
            >
              Send Message
            </button>
            {emailSubmitted && (
              <p className="text-sm mt-2">
                Email sent successfully!
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;