import React from "react";

interface TextInputProps {
  label: string;
  name: string;
  type: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput: React.FC<TextInputProps> = ({ label, name, type, value, placeholder, onChange }) => {
  return (
    <div className="mb-6">
      <label
        htmlFor={name}
        className="text-white block mb-2 text-sm font-medium"
      >
        {label}
      </label>
      <input
        name={name}
        type={type}
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

export default TextInput;
