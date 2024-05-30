"use client"

import Image from "next/image";
import Link from "next/link";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import AchievementsSection from "./Achievements";
import { GitHubLogoIcon, LinkedInLogoIcon, InstagramLogoIcon, TwitterLogoIcon, DownloadIcon } from "@radix-ui/react-icons"

const Socials = [
  {
    icon: <GitHubLogoIcon />,
    href: "https://github.com/jainhardik120",
    alt: "GitHub"
  },
  {
    icon: <LinkedInLogoIcon />,
    href: "https://linked.com/in/jainhardik120",
    alt: "LinkedIn"
  },
  {
    icon: <InstagramLogoIcon />,
    href: "https://instagram.com/_.hardikj",
    alt: "Instagram"
  },
  {
    icon: <TwitterLogoIcon />,
    href: "https://twitter.com/jainhardik17",
    alt: "Twitter"
  },
]

const ProfileSection: React.FC = () => {
  return (
    <>
      <section id="profile" className="lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 dark:text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="col-span-8 place-self-center text-center md:text-left justify-self-start"
            id="hero_text"
          >
            <div>
              <h1 className="mb-4 text-4xl md:text-6xl lg:text-8xl lg:leading-normal font-extrabold lg:min-h-[432px] lg:max-w-[600px] md:min-h-[180px] w-[350px] md:w-fit">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-600">
                  Hello, I&apos;m{" "}
                </span>
                <br />
                <span className="block">
                  <TypeAnimation
                    sequence={[
                      "Hardik Jain",
                      1000,
                      "Web Developer",
                      1000,
                      "Mobile Developer",
                      1000
                    ]}
                    wrapper="span"
                    speed={50}
                    repeat={Infinity}
                  />
                </span>
              </h1>
            </div>
            <div className="flex flex-col md:flex-row gap-4 w-full items-center">
              <Link
                href="/"
                className="h-12 rounded-full max-w-fit flex justify-center items-center px-4 gap-4 border-2 border-white"
              >
                Download CV
                <DownloadIcon />
              </Link>
              <div className="flex flex-row gap-4">
                {
                  Socials.map((value) => {
                    return (<>
                      <Link href={value.href} aria-label={value.alt} className="w-12 h-12  border-2 border-white rounded-full flex justify-center items-center">
                        {value.icon}
                      </Link>
                    </>)
                  })
                }
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="col-span-4 place-self-center mt-4 lg:mt-0"
          >
            <div className="rounded-full bg-gray-200 dark:bg-[#181818] w-[250px] h-[250px] lg:w-[400px] lg:h-[400px]">
              <Image
                src="/images/hero-image.jpg"
                alt="hero image"
                width={800}
                height={800}
                className="rounded-full"
              />
            </div>
          </motion.div>
        </div>
        <AchievementsSection />
      </section>
    </>
  );
};

export default ProfileSection;
