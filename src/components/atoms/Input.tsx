import * as React from 'react';
import { Loader } from '@mantine/core';

interface InputProps {
  label: string
  id: string
  value: string | number
  errorLabel?: string
  disabled?: boolean
  readOnly?: boolean
  isLoading?: boolean
  type?: 'text' | 'email' | 'password' | 'number'
  maxLength?: number
  min?: number
  max?: number
  onChange: (e: React.ChangeEvent<HTMLInputElement> | string) => void
}

const Input: React.FC<InputProps> = ({
  label,
  id,
  value,
  errorLabel,
  disabled,
  isLoading,
  type = 'text',
  maxLength,
  min,
  max,
  onChange,
}) => {
  return (
    <div className="flex flex-col my-2 relative gap-1">
      <label htmlFor={id} className="text-[14px] font-medium text-one">
        {label} :
      </label>
      <input
        id={id}
        type={type}
        value={value}
        min={min}
        max={max}
        onChange={e => onChange(e.target.value)}
        disabled={isLoading || disabled}
        maxLength={maxLength}
        className={`border border-[#EFF0F0] rounded-[10px] h-[45px] pl-3 text-[14px] font-medium text-one outline-none ${
          disabled ? 'bg-[#F4F5F7]' : ''
        }`}
      />
      {errorLabel ? <p className="text-red-500 text-[12px]">{errorLabel}</p> : null}
      {isLoading ? (
        <Loader color="gray" size="xs" className="absolute bottom-2 right-3" />
      ) : null}
    </div>
  )
}

export default Input;
