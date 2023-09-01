import * as React from 'react';
import { Loader } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from '@mantine/dropzone';
import Image from 'next/image';
import { FiImage } from 'react-icons/fi';

interface InputProps {
  label: string;
  id: string;
  value: string;
  errorLabel?: string;
  readOnly?: boolean;
  isLoading?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement> | string) => void;
}

const InputImage: React.FC<InputProps> = ({ label, id, value, errorLabel, isLoading, onChange }) => {
  const [error, setError] = React.useState('');
  const [blob, setBlob] = React.useState<string>();

  const handleDrop = (e: FileWithPath[]) => {
    const file = e[0];
    if (file.size > 1000000) {
      setError('File tidak boleh melebihi 1MB');
    } else {
      setBlob(URL.createObjectURL(file));
      onChange(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
  };

  return (
    <div className="flex flex-col my-2 relative gap-1">
      <label htmlFor={id} className="text-[14px] font-medium text-one">
        {label} :
      </label>
      <Dropzone p={15} accept={IMAGE_MIME_TYPE} onChange={handleOnChange} onDrop={handleDrop} onErrorCapture={() => console.log('File tidak boleh melebihi 1MB')} className="w-[150px] h-[150px] rounded-full grid place-items-center">
        {blob ? <Image src={blob} alt="tes" width={100} height={100} className="w-[120px] h-[120px] rounded-full shadow-xl" /> : <FiImage />}
      </Dropzone>
      {errorLabel || error ? <p className="text-red-500 text-[12px]">{errorLabel || error}</p> : null}
      {isLoading ? <Loader color="gray" size="xs" className="absolute bottom-2 right-3" /> : null}
    </div>
  );
};

export default InputImage;
