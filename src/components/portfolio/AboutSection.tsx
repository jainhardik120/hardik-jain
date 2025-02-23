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
    <section id="about" className=" min-h-screen container mx-auto px-12 flex">
      <div className="flex flex-col my-auto gap-12 mx-auto">
        <h2 className="text-center text-4xl font-bold">About Me</h2>
        <ol className="relative border-s border-gray-200 dark:border-gray-700">
          {experiences.map((experience, index) => (
            <li key={index} className={`ms-6 ${index !== experiences.length - 1 ? 'mb-10' : ''}`}>
              <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                <svg
                  className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                </svg>
              </span>
              <h3 className="flex items-center mb-1 text-lg font-bold text-gray-900 dark:text-white">
                {experience.company}
              </h3>
              <h4 className="flex items-center mb-1 text-md font-semibold text-gray-900 dark:text-white">
                {experience.title}
              </h4>
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
