import React from "react";

interface TextareaInputProps {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextareaInput: React.FC<TextareaInputProps> = ({ label, name, value, placeholder, onChange }) => {
  return (
    <div className="mb-6">
      <label
        htmlFor={name}
        className="text-tsecondary-light dark:text-tsecondary-dark block text-sm mb-2 font-medium"
      >
        {label}
      </label>
      <textarea
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        required
        className="dark:bg-[#18191E] border dark:border-[#33353F] dark:placeholder-[#9CA2A9] text-sm rounded-lg block w-full p-2.5"
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextareaInput;
