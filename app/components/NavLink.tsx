import Link from "next/link";
import React from "react";

const NavLink: React.FC<{ href: string, title: string }> = ({ href, title }) => {
  return (
    <Link
      href={href}
      className="block py-2 pl-3 pr-4 dark:text-[#ADB7BE] sm:text-xl rounded md:p-0 dark:hover:text-white"
    >
      {title}
    </Link>
  );
};

export default NavLink;