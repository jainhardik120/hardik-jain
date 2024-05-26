"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import TextInput from "@/app/components/TextInput";
import Button from "@/app/components/Button";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        router.push("/admin");
      } else {
        const body = await response.json();
        setError(body.error || "Invalid email or password");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            name="email"
            type="email"
            value={email}
            placeholder=""
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextInput
            label="Password"
            name="password"
            type="password"
            value={password}
            placeholder=""
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Login</Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
