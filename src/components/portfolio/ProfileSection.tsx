'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
const TypeAnimation = dynamic(
  () => import('react-type-animation').then((mod) => mod.TypeAnimation),
  {
    ssr: false,
    loading: () => <span>Hardik Jain</span>,
  },
);
import AchievementsSection from './AchievementsSection';
import React from 'react';
import { LinkIcon } from 'lucide-react';
import { env } from '@/env';
import { Socials } from '@/types/constants';
import { Button } from '../ui/button';

const HeroImage = React.memo(() => {
  return (
    <div className="relative">
      <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
      <Image
        src="/images/hero-image.jpg"
        alt="hero image"
        width={800}
        height={800}
        className="relative rounded-full shadow-xl"
        priority={true}
      />
    </div>
  );
});
HeroImage.displayName = 'HeroImage';

const ResumeUrl = `${env.NEXT_PUBLIC_FILE_STORAGE_HOST}/Resume.pdf`;

const ProfileSection: React.FC = () => {
  return (
    <section id="profile" className="profile-section sm:px-12 items-center">
      <div className="absolute inset-0 dark:bg-grid-white/[0.06] bg-grid-black/[0.04] [mask-image:linear-gradient(to_bottom,white_5%,transparent_40%)] pointer-events-none select-none"></div>
      <div className="my-auto flex flex-col gap-8 z-10">
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div
            className="col-span-8 place-self-center text-center md:text-left flex flex-col items-center justify-self-start"
            id="hero_text"
          >
            <div className="w-full">
              <h1 className="mb-4 font-extrabold text-4xl w-[360px] min-h-[80px] md:text-6xl md:min-h-[180px] md:w-[400px] xl:leading-normal xl:text-8xl xl:min-h-[432px] xl:w-[600px]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-500">
                  Hello, I&apos;m{' '}
                </span>
                <br />
                <span className="block">
                  <TypeAnimation
                    sequence={[
                      'Hardik Jain',
                      1000,
                      'Web Developer',
                      1000,
                      'Android Developer',
                      1000,
                    ]}
                    wrapper="span"
                    speed={50}
                    repeat={Infinity}
                  />
                </span>
              </h1>
            </div>
            <div className="md:hidden rounded-full w-full h-full max-w-[250px] max-h-[250px] my-10">
              <HeroImage />
            </div>
            <div className="flex flex-col xl:flex-row gap-4 w-full items-center md:items-start">
              <a href={ResumeUrl} target="_blank">
                <Button className="h-12 rounded-full w-[240px] flex justify-center items-center px-4 gap-2">
                  Open Resume
                  <LinkIcon />
                </Button>
              </a>
              <div className="flex flex-row gap-4">
                {Socials.map((value) => {
                  return (
                    <Button
                      key={value.href}
                      asChild
                      className="w-12 h-12 rounded-full"
                      variant="outline"
                      size="icon"
                    >
                      <a href={value.href} aria-label={value.alt} target="_blank">
                        <value.icon />
                      </a>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="col-span-4 place-self-center mt-4 lg:mt-0 hidden md:block">
            <div className="rounded-full w-[250px] h-[250px] xl:w-[400px] xl:h-[400px]">
              <HeroImage />
            </div>
          </div>
        </div>
        <AchievementsSection />
      </div>
    </section>
  );
};

export default ProfileSection;
