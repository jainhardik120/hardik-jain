import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const NavLink: React.FC<{ href?: string, title: string, onClick?: () => Promise<void> }> = ({ href, title, onClick }) => {
  const router = useRouter();
  return (
    <>
      {href ? (
        <>
          <Link href={href} onClick={async () => {
            if (onClick) {
              await onClick();
            }
          }}
            className="block py-2 pl-3 pr-4 dark:text-[#ADB7BE] sm:text-xl rounded md:p-0 dark:hover:text-white" prefetch={false}>
            {title}
          </Link>
        </>
      ) : (<>
        {onClick && (
          <button
            onClick={onClick}
            type="button"
            className="block py-2 pl-3 pr-4 dark:text-[#ADB7BE] sm:text-xl rounded md:p-0 dark:hover:text-white cursor-pointer"
          >
            {title}
          </button>
        )}
      </>)}
    </>
  );
};

export default NavLink;