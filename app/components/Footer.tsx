import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="py-12 px-24 flex flex-col justify-center text-center sm:flex-row sm:justify-between gap-8 sm:gap-0">
        <p>Hardik Jain</p>
        <p>All rights reserved</p>
        <Link href="/admin">Admin Home Page</Link>
      </div>
    </footer>
  );
};

export default Footer;