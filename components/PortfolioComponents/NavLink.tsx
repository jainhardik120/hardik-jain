import React from "react";
import { useRouter } from "next/navigation";

const NavLink: React.FC<{ href: string, title: string, onClick? : ()=>void }> = ({ href, title, onClick }) => {
  const router = useRouter();
  return (
    <button
      onClick={
        () => {
          router.push(href);
          if(onClick){
            onClick();
          }
        }
      }
      type="button"
      className="block py-2 pl-3 pr-4 dark:text-[#ADB7BE] sm:text-xl rounded md:p-0 dark:hover:text-white"
    >
      {title}
    </button>
  );
};

export default NavLink;