"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import NavLink from "./NavLink";
import MenuOverlay from "./MenuLink";
import ThemeSwitcher from "./ThemeSwitcher";

const navLinks = [
	{
		title: "About",
		path: "#about",
	},
	{
		title: "Skills",
		path: "#skills",
	},
	{
		title: "Projects",
		path: "#projects",
	},
	{
		title: "Blog",
		path: "#blog",
	},
	{
		title: "Contact",
		path: "#contact",
	},
];

const Navbar = () => {
	const [navbarOpen, setNavbarOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const profileSection = document.getElementById("hero_text");
			if (profileSection) {
				const profileSectionRect = profileSection.getBoundingClientRect();
				const isVisible = profileSectionRect.top >= 0 && profileSectionRect.bottom <= window.innerHeight;
				const x = document.getElementById("nav-logo");
				if (x) {
					if (isVisible) {
						x.classList.add("hidden");
					} else {
						x.classList.remove("hidden");
					}
				}
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<nav className="fixed mx-auto top-0 left-0 right-0 z-10 bg-opacity-100 h-20 bg-white dark:bg-[#121212]">
			<div className="flex container lg:py-4 flex-wrap items-center justify-between mx-auto px-4 py-2 h-full">
				<Link
					id="nav-logo"
					href={"/"}
					className="text-2xl md:text-4xl font-semibold hidden"
				>
					Hardik Jain
				</Link>
				<div></div>
				<div className="mobile-menu block lg:hidden">
					{!navbarOpen ? (
						<button
							type="button"
							title="hamburger menu"
							onClick={() => setNavbarOpen(true)}
							className="flex items-center px-3 py-2 dark:text-slate-200 dark:hover:text-white "
						>
							<Bars3Icon className="h-5 w-5" />
						</button>
					) : (
						<button
							type="button"
							title="close menu"
							onClick={() => setNavbarOpen(false)}
							className="flex items-center px-3 py-2 dark:text-slate-200 dark:hover:text-white "
						>
							<XMarkIcon className="h-5 w-5" />
						</button>
					)}
				</div>
				<div className="menu hidden lg:block lg:w-auto" id="navbar">
					<ul className="flex p-4 lg:p-0 lg:flex-row lg:space-x-8 mt-0">
						{navLinks.map((link, index) => (
							<li key={index}>
								<NavLink href={link.path} title={link.title} />
							</li>
						))}
						<li>
							<div className="py-2 pl-3 pr-4 md:p-0 h-full flex items-center">
								<ThemeSwitcher />
							</div>
						</li>
					</ul>
				</div>
			</div>
			{navbarOpen ? <MenuOverlay links={navLinks} /> : null}
		</nav>
	);
};

export default Navbar;