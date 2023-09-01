import React from 'react';
import { Loader } from '@mantine/core';

interface ButtonProps {
  type?: 'submit' | 'button';
  className?: string;
  color?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ type, className, color = '#34A853', children, isLoading, isDisabled, onClick }) => {
  return (
    <button
      type={type || 'button'}
      style={{ background: color }}
      disabled={isLoading || isDisabled}
      className={`rounded-[10px] shadow-md min-w-[100px] h-[38px] font-bold text-[14px] active:scale-95 active:shadow-none transition-all px-6 capitalize ${className || ''} ${isLoading ? 'grid place-items-center opacity-70' : ''} ${
        color !== '#fff' ? 'text-secondary' : ''
      }`}
      onClick={onClick}>
      {isLoading ? <Loader style={{ fill: '#fff' }} variant="dots" size="sm" /> : children}
    </button>
  );
};

export default Button;
