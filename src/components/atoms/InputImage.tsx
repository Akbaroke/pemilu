import * as React from 'react'
import { Loader } from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from '@mantine/dropzone'
import Image from 'next/image'
import { FiImage } from 'react-icons/fi'

interface InputProps {
  label: string
  id: string
  value: string
  errorLabel?: string
  readOnly?: boolean
  isLoading?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement> | string) => void
}

const InputImage: React.FC<InputProps> = ({
  label,
  id,
  value,
  errorLabel,
  isLoading,
  onChange,
}) => {
  const [error, setError] = React.useState('')
  const [blob, setBlob] = React.useState<string>()

  const handleDrop = (e: FileWithPath[]) => {
    const file = e[0]
    if (file.size > 1000000) {
      setError('File tidak boleh melebihi 1MB')
      onChange('')
      setBlob('')
    } else {
      setBlob(URL.createObjectURL(file))
      onChange(URL.createObjectURL(file))
      setError('')
    }
  }

  return (
    <div className="flex flex-col my-2 relative gap-1">
      <label htmlFor={id} className="text-[14px] font-medium text-one">
        {label} :
      </label>
      <Dropzone
        p={15}
        accept={IMAGE_MIME_TYPE}
        onDrop={handleDrop}
        onErrorCapture={() => console.log('File tidak boleh melebihi 1MB')}
        className="border border-two border-dashed rounded-[10px] grid place-items-center min-h-[100px]">
        {blob ? (
          <Image
            src={blob}
            alt="tes"
            width={100}
            height={100}
            className="w-[120px] h-[120px] rounded-full shadow-xl"
          />
        ) : (
          <div className="flex flex-col gap-1 items-center">
            <FiImage className="text-[30px] text-two" />
            <p className="text-two text-[12px]">Foto size max. 1MB</p>
          </div>
        )}
      </Dropzone>
      {errorLabel || error ? (
        <p className="text-red-500 text-[12px]">{errorLabel || error}</p>
      ) : null}
      {isLoading ? (
        <Loader color="gray" size="xs" className="absolute bottom-2 right-3" />
      ) : null}
    </div>
  )
}

export default InputImage
