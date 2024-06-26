import Link from "next/link";
import React from "react";
import { ModeToggle } from "./theme-mode-toggle";

const Footer = () => {
  return (
    <footer className="mt-auto">
      <div className="container mx-auto py-8 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          <p className="text-lg font-semibold">Hardik Jain</p>
          <p className="text-sm">All rights reserved</p>
        </div>
        <Link href="/admin" className="text-[color:var(--primary)] hover:text-[color:var(--primary-foreground)] transition duration-300 ease-in-out" prefetch={false}>
          Admin Home Page
        </Link>
        <ModeToggle />
      </div>
    </footer>
  );
};

export default Footer;
