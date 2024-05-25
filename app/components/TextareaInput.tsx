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
        className="text-white block text-sm mb-2 font-medium"
      >
        {label}
      </label>
      <textarea
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        required
        className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5"
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextareaInput;
