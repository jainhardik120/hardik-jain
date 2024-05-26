/* eslint-disable @next/next/no-img-element */

export const ProjectTag: React.FC<{ name: string; onClick: (name: string) => void; isSelected: boolean; }> = ({ name, onClick, isSelected }) => {
  const buttonStyles = isSelected
    ? "border-primary-500 dark:border-primary-300"
    : "border-slate-600 hover:border-black dark:text-[#6B7280] dark:border-gray-500 dark:hover:border-gray-300";

  return (
    <button
      type="button"
      className={`${buttonStyles} rounded-full border-2 px-6 py-3 text-xl cursor-pointer`}
      onClick={() => onClick(name)}
    >
      {name}
    </button>
  );
};
