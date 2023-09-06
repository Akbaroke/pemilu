import React from 'react'
import { Loader } from '@mantine/core'
import cn from '@/utils/cn'

interface ButtonProps {
  type?: 'submit' | 'button'
  className?: string
  color?: string
  children: React.ReactNode
  isLoading?: boolean
  isDisabled?: boolean
  onClick?: () => void
}

const Button: React.FC<ButtonProps> = ({
  type,
  className,
  children,
  isLoading,
  isDisabled,
  onClick,
}) => {
  return (
    <button
      type={type || 'button'}
      disabled={isLoading || isDisabled}
      className={cn(
        'rounded-[10px] shadow-md min-w-[100px] h-[45px] font-bold text-[15px] active:scale-95 active:shadow-none transition-all px-6 capitalize bg-success text-white',
        className,
        {
          'grid place-items-center opacity-70 shadow-none active:scale-100':
            isLoading || isDisabled,
        },
        {
          'cursor-not-allowed': isDisabled,
        },
        {
          'cursor-wait': isLoading,
        }
      )}
      onClick={onClick}>
      {isLoading ? (
        <Loader style={{ fill: '#fff' }} variant="dots" size="sm" />
      ) : (
        children
      )}
    </button>
  )
}
export default Button
