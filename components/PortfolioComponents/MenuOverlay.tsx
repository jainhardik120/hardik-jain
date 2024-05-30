import React from "react";
import NavLink from "./NavLink";
import ThemeSwitcher from "./ThemeSwitcher";

const MenuOverlay: React.FC<{ links: { title: string, path?: string, onClick?: () => Promise<void> }[], onClick?: () => Promise<void> }> = ({ links, onClick }) => {
  return (
    <ul className="flex flex-col py-4 items-center justify-center bg-background">
      {links.map((link, index) => (
        <li key={index} className="my-4">
          <NavLink href={link.path} title={link.title} onClick={async ()=>{
            if(link.onClick){
              await link.onClick();
            }
            if(onClick){
              await onClick();
            }
          }} />
        </li>
      ))}
      <li className="my-4">
        <ThemeSwitcher />
      </li>
    </ul>
  );
};

export default MenuOverlay;