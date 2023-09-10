import React, { InputHTMLAttributes } from 'react';
import { BiSearchAlt } from 'react-icons/bi';

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder, ...props }) => {
  return (
    <div className="border border-two rounded-[10px] bg-white px-[20px] flex justify-between items-center h-[45px]">
      <input
        type="text"
        placeholder={placeholder}
        className="w-full h-full outline-none"
        {...props}
      />
      <BiSearchAlt size={18} />
    </div>
  )
};

export default SearchInput;
