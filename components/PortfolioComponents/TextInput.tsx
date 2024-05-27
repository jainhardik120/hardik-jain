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
        className="text-tsecondary-light dark:text-tsecondary-dark block mb-2 text-sm font-medium"
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
        className="dark:bg-[#18191E] border dark:border-[#33353F] dark:placeholder-[#9CA2A9] text-sm rounded-lg block w-full p-2.5"
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextInput;
