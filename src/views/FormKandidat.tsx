import * as React from 'react';
import Input from '@/components/Input';
import { isNotEmpty, useForm } from '@mantine/form';
import InputImage from '@/components/InputImage';

type PemiluFormType = {
  name: string;
  image: string;
  color: string;
};

export default function FormKandidat() {
  const form = useForm<PemiluFormType>({
    initialValues: {
      name: '',
      image: '',
      color: '',
    },
    validate: {
      name: isNotEmpty('Nama tidak boleh kosong.'),
      image: isNotEmpty('Foto tidak boleh kosong.'),
      color: isNotEmpty('Warna tidak boleh kosong.'),
    },
  });

  React.useEffect(() => {
    console.log(form.values);
  }, [form.values]);

  return (
    <form>
      <Input label="Name" id="name" type="text" value={form.values.name} errorLabel={form.errors.name as string} onChange={(e) => form.setFieldValue('name', e as string)} />
      <InputImage label="Image" id="image" value={form.values.image} errorLabel={form.errors.image as string} onChange={(e) => form.setFieldValue('image', e as string)} />
    </form>
  );
}
