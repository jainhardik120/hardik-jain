"use client";

import React, { useState } from "react";
import GithubIcon from "../../../public/github-icon.svg";
import LinkedinIcon from "../../../public/linkedin-icon.svg";
import Image from "next/image";
import TextInput from "../TextInput";
import TextareaInput from "../TextareaInput";

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
    <section
      id="contact"
      className="grid md:grid-cols-2 my-12 md:my-12 py-24 gap-4 relative"
    >
      <div>
        <h5 className="text-xl font-bold text-white my-2">
          Let&apos;s Connect
        </h5>
        <p className="text-[#ADB7BE] mb-4 max-w-md">
          I&apos;m currently looking for new opportunities, my inbox is always
          open. Whether you have a question or just want to say hi, I&apos;ll
          try my best to get back to you!
        </p>
        <div className="socials flex flex-row gap-2">
          <a href="https://github.com/jainhardik120" aria-label="github" target="_blank" rel="noopener">
            <Image src={GithubIcon} alt="Github Icon" />
          </a>
          <a href="https://linkedin.com/in/jainhardik120" aria-label="linkedin" target="_blank" rel="noopener">
            <Image src={LinkedinIcon} alt="Linkedin Icon" />
          </a>
        </div>
      </div>
      <div>
        {emailSubmitted ? (
          <p className="text-green-500 text-sm mt-2">
            Email sent successfully!
          </p>
        ) : (
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
          </form>
        )}
      </div>
    </section>
  );
};

export default ContactSection;