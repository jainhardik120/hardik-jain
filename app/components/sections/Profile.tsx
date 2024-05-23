const ProfileSection: React.FC = () => {
  return (
    <>
      <section id="profile">
        <div className="w-full flex justify-center items-center">
          <div className="ml-8">
            <p className="text-xl">Hello, I&apos;m</p>
            <p className="text-6xl font-medium">Hardik Jain</p>
            <p className="text-3xl">Software Developer</p>
            <div className="mt-4">
              <button type="button" onClick={() => {

              }}>
                Download CV
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ProfileSection;