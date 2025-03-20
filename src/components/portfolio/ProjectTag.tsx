export const ProjectTag: React.FC<{
  name: string;
  onClick: (name: string) => void;
  isSelected: boolean;
}> = ({ name, onClick, isSelected, ...props }) => {
  const buttonStyles = isSelected
    ? 'border-primary'
    : 'border-border text-muted-foreground hover:border-secondary-foreground';

  return (
    <button
      type="button"
      className={`${buttonStyles} flex-1 rounded-full border-2 px-6 py-3 text-xl cursor-pointer`}
      onClick={() => onClick(name)}
      {...props}
    >
      {name}
    </button>
  );
};
