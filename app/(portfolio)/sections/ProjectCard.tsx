/* eslint-disable @next/next/no-img-element */

export const ProjectCard: React.FC<{ imgUrl: string; title: string; description: string; gitUrl: string; previewUrl: string; }> = ({ imgUrl, title, description, gitUrl, previewUrl }) => {
  return (
    <div className="relative md:h-[196px] max-w-[350px] overflow-hidden flex items-end rounded-lg group">
      <img
        src={imgUrl}
        alt={title}
        className="transition-transform duration-300 group-hover:scale-110 w-full h-full object-cover" />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h5 className="text-4xl font-semibold text-white mb-4">{title}</h5>
        <div className="flex justify-center space-x-8">
          <a
            href={gitUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 w-10 text-gray-400 group-hover:text-white flex items-center justify-center underline underline-offset-2"
          >
            Github
          </a>
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 w-10 text-gray-400 group-hover:text-white flex items-center justify-center underline underline-offset-2"
          >
            Preview
          </a>
        </div>
      </div>
    </div>
  );
};
