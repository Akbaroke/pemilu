import * as React from 'react'
import { Loader } from '@mantine/core'
import { DateTimePicker, DateValue } from '@mantine/dates'

interface InputProps {
  label: string
  id: string
  value: DateValue
  errorLabel?: string
  disabled?: boolean
  readOnly?: boolean
  isLoading?: boolean
  minDate?: Date
  onChange: (e: DateValue) => void
}

const InputDateTime: React.FC<InputProps> = ({
  label,
  id,
  value,
  errorLabel,
  disabled,
  isLoading,
  minDate,
  onChange,
}) => {
  return (
    <div className="flex flex-col my-2 relative gap-1">
      <label htmlFor={id} className="text-[14px] font-medium text-one">
        {label} :
      </label>
      <DateTimePicker
        variant="unstyled"
        id={id}
        value={
          value?.getTime() == new Date('1970-01-01T00:00:00.000Z')?.getTime()
            ? new Date(new Date().getTime())
            : value
        }
        minDate={minDate}
        onChange={(value: DateValue) => onChange(value)}
        disabled={isLoading || disabled}
        className={`border border-[#EFF0F0] rounded-[10px] h-[45px] pl-3 pt-1 text-[14px] font-normal text-one outline-none ${
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

export default InputDateTime
