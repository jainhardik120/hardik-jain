import Image from "next/image";
import Link from "next/link";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import AchievementsSection from "./Achievements";

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
            <h1 className="mb-4 text-4xl md:text-6xl lg:text-8xl lg:leading-normal font-extrabold lg:min-h-[432px] lg:max-w-[600px] md:min-h-[180px]">
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
            <div>
              <Link
                href="/#contact"
                className="px-6 inline-block py-3 w-full sm:w-fit rounded-full mr-4 bg-gradient-to-br from-primary-500 to-secondary-500 hover:bg-slate-200 text-white dark:hover:bg-slate-700"
              >
                Download CV
              </Link>
              <Link
                href="/"
                className="px-1 inline-block py-1 w-full sm:w-fit rounded-full bg-gradient-to-br from-primary-500 to-secondary-500  mt-3"
              >
                <span className="block bg-white dark:bg-[#121212] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full px-5 py-2">
                  Github
                </span>
              </Link>
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
