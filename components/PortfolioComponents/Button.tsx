import React from 'react';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  className = '',
  onClick,
  children,
}) => {
  return (
    <button
      type={type}
      className={`bg-primary-500 hover:bg-primary-600 text-white font-medium py-2.5 px-5 rounded-lg w-full ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
