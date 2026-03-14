import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const PrimaryButton: React.FC<Props> = ({ children, className = '', ...rest }) => {
  return (
    <button
      className={`bg-black text-white rounded-lg px-4 py-3 text-sm font-medium active:scale-[0.98] ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

