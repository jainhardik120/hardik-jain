import SkillCard from "../SkillCard";

const SkillsSection: React.FC = () => {
    const skillsData = [
        {
            title: 'Programming Languages',
            skills: ['C++', 'Kotlin', 'JavaScript', 'Typescript'],
        },
        {
            title: 'Tools & Technologies',
            skills: ['Git & GitHub', 'Docker', 'AWS', 'Android Studio', 'Remix IDE'],
        },
        {
            title: 'Web Development',
            skills: ['HTML & CSS', 'React', 'Node.js', 'Next.js', 'Express', 'MongoDB', 'PostgreSQL'],
        },
        {
            title: 'Android Development',
            skills: ['Kotlin', 'Jetpack Compose', 'Dagger Hilt', 'Room Database', 'MVVM', 'Ktor', 'Retrofit'],
        },
        {
            title: 'Blockchain Development',
            skills: ['Solidity', 'EtherJS', 'Hardhat', 'Metamask', 'OpenZeppelin'],
        }
    ];

    return (
        <section id="skills">
            <p className="section_header">Skills</p>
            <div className="mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 ">
                    {skillsData.map((skillSet, index) => (
                        <SkillCard key={index} title={skillSet.title} skills={skillSet.skills} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SkillsSection;
