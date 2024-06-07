"use client"

import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import AchievementsSection from "./AchievementsSection";
import { GitHubLogoIcon, LinkedInLogoIcon, InstagramLogoIcon, TwitterLogoIcon, DownloadIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button";

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

const ResumeUrl = "https://hardik-jain-blog-content.s3.eu-north-1.amazonaws.com/uploads/2024-06-05T13-56-13-118Z_Hardik%20Jain%20CV.pdf";

const ProfileSection: React.FC = () => {
  const handleDownload = async () => {
    const response = await (await fetch(ResumeUrl)).blob();
    const url = URL.createObjectURL(response);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Hardik Jain CV.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <>
      <section id="profile" className="snap-start h-screen sm:px-12 container mx-auto flex flex-col items-center min-h-screen">
        <div className="my-auto flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-12">
            <div
              className="col-span-8 place-self-center text-center md:text-left flex flex-col items-center justify-self-start"
              id="hero_text"
            >
              <div className="w-full">
                <h1 className="mb-4 text-4xl md:text-6xl xl:text-8xl xl:leading-normal font-extrabold xl:min-h-[432px] xl:w-[600px] md:min-h-[180px] w-[350px] md:w-[400px]">
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
                        "Android Developer",
                        1000
                      ]}
                      wrapper="span"
                      speed={50}
                      repeat={Infinity}
                    />
                  </span>
                </h1>
              </div>
              <div className="md:hidden rounded-full w-[250px] h-[250px] xl:w-[400px] xl:h-[400px] my-10">
                <Image
                  src="/images/hero-image.jpg"
                  alt="hero image"
                  width={800}
                  height={800}
                  className="rounded-full"
                  priority={true}
                />
              </div>
              <div className="flex flex-col xl:flex-row gap-4 w-full items-center md:items-start">
                <Button
                  className="h-12 rounded-full w-[240px] flex justify-center items-center px-4 gap-2"
                  onClick={handleDownload}
                >
                  Download CV
                  <DownloadIcon />
                </Button>
                <div className="flex flex-row gap-4">
                  {
                    Socials.map((value, index) => {
                      return (
                        <a href={value.href} key={value.alt} aria-label={value.alt} className="w-12 h-12 border-2 border-border rounded-full flex justify-center items-center">
                          {value.icon}
                        </a>
                      )
                    })
                  }
                </div>
              </div>
            </div>
            <div
              className="col-span-4 place-self-center mt-4 lg:mt-0 hidden md:block"
            >
              <div className="rounded-full w-[250px] h-[250px] xl:w-[400px] xl:h-[400px]">
                <Image
                  src="/images/hero-image.jpg"
                  alt="hero image"
                  width={800}
                  height={800}
                  className="rounded-full"
                  priority={true}
                />
              </div>
            </div>
          </div>
          <AchievementsSection />
        </div>
      </section>
    </>
  );
};

export default ProfileSection;
