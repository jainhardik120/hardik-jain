import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container p-12 flex justify-between">
        <p>Hardik Jain</p>
        <p>All rights reserved.</p>
        <Link href="/admin">Admin Home Page</Link>
      </div>
    </footer>
  );
};

export default Footer;