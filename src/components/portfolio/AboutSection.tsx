import { CalendarDays } from 'lucide-react';
import React from 'react';

const AboutSection: React.FC = () => {
  const experiences = [
    {
      title: 'Technical Intern',
      company: 'Cisco',
      period: 'Jan 2025 - Present',
      description:
        'Developing and automating test cases for the Compute UCSM team using Google Test framework.',
    },
    {
      title: 'Software Developer Intern',
      company: 'Serve and Volley Technologies',
      period: 'May 2024 - Nov 2024',
      description:
        'Built Moonlight, a job search platform with Next.js, TypeScript, MongoDB, and Stream Chat SDK.',
    },
    {
      title: 'B.Tech in Computer Science',
      company: 'Jaypee Institute of Information Technology',
      period: '2021 - 2025',
      description:
        'Graduating with a CGPA of 8.9, specializing in software development and computer systems.',
    },
  ];

  return (
    <section id="about" className="profile-section px-12">
      <div className="flex flex-col my-auto gap-12 mx-auto">
        <h2 className="text-center">About Me</h2>
        <ol className="relative border-s border-gray-200 dark:border-gray-700">
          {experiences.map((experience, index) => (
            <li key={index} className={`ms-6 ${index !== experiences.length - 1 ? 'mb-10' : ''}`}>
              <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                <CalendarDays className="w-4 h-4 text-blue-800 dark:text-blue-300" />
              </span>
              <p className="flex items-center mb-1 text-lg font-bold text-gray-900 dark:text-white">
                {experience.company}
              </p>
              <p className="flex items-center mb-1 text-md font-semibold text-gray-900 dark:text-white">
                {experience.title}
              </p>
              <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                {experience.period}
              </time>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                {experience.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default AboutSection;
