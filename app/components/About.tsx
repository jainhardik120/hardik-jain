const AboutSection: React.FC = () => {
  return (
    <section id="about">
      <h2 className="text-center text-4xl font-bold mt-4 mb-8 md:mb-12">
        About Me
      </h2>
      <div className="max-w-3xl mx-auto">
        <div className="section-content mb-8">
          <h3 className="text-2xl font-semibold mb-4">Education</h3>
          <p>
            I am currently pursuing a Bachelor&apos;s degree in <span className="font-semibold text-indigo-600">Computer Science</span> at <span className="font-semibold text-indigo-600">Jaypee Institute of Information Technology</span>, where I have maintained a GPA of <span className="font-semibold text-indigo-600">9.1</span>.
          </p>
        </div>
        <div className="section-content mb-8">
          <h3 className="text-2xl font-semibold mb-4">Knowledge</h3>
          <ul className="list-disc list-inside ml-5">
            <li>Data Structures and Algorithms (DSA)</li>
            <li>Object-Oriented Programming (OOP)</li>
            <li>Computer Networks</li>
            <li>Database Management Systems (DBMS)</li>
            <li>Operating Systems (OS)</li>
            <li>Other core Computer Science subjects</li>
          </ul>
        </div>
        <div className="section-content mb-8">
          <h3 className="text-2xl font-semibold mb-4">Development Experience</h3>
          <p>
            I am an experienced Android and web developer with several published applications that have been downloaded thousands of times.
          </p>
        </div>
        <div className="section-content">
          <h3 className="text-2xl font-semibold mb-4">Achievements</h3>
          <p>
            I have solved over <span className="font-semibold text-indigo-600">500 problems</span> on LeetCode, showcasing my strong problem-solving abilities.
          </p>
          <p>
            My android application <span className="font-semibold text-indigo-600">JIIT Buddy</span> has reached a total of <span className="font-semibold text-indigo-600">5000+</span> downloads on Play Store.
          </p>
        </div>
      </div>
    </section>
  )
}

export default AboutSection;
