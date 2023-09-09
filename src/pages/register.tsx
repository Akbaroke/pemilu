import React from 'react';
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Layout from '@/components/templates/Layout'
import { isEmail, useForm } from '@mantine/form'
import { RegisterFormType } from '@/types/auth'
import Link from 'next/link'
import GoogleAuthButton from '@/components/atoms/GoogleAuthButton'
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '@/lib/firebase/init'
import { notifyError, notifyLoading, notifySuccess } from '@/components/molecules/Toast'
import { useRouter } from 'next/router'
import crypto from 'crypto'

export default function Register() {
  const { push } = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<RegisterFormType>({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validate: {
      name: value => {
        if (value.length < 3) {
          return 'Password minimal 3 karakter.'
        }
        return null
      },
      email: isEmail('Email tidak valid.'),
      password: value => {
        if (value.length < 8) {
          return 'Password minimal 8 karakter.'
        }
        return null
      },
    },
  })

  const handleSubmit = async (value: RegisterFormType) => {
    notifyLoading('Mendaftar diproses...', 'register')
    try {
      setIsLoading(true)
      const q = query(collection(firestore, 'users'), where('email', '==', value.email))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      if (data.length > 0) {
        notifyError('Email sudah terdaftar', 'register')
      } else {
        const salt = process.env.NEXT_PUBLIC_SALT as string
        const hashedPassword = crypto
          .createHmac('sha256', salt)
          .update(value.password)
          .digest('hex')
        await addDoc(collection(firestore, 'users'), {
          ...value,
          password: hashedPassword,
        })
        notifySuccess('Berhasil mendaftar', 'register')
        push('/login')
      }
    } catch (error) {
      notifyError('Gagal mendaftar', 'register')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <h1 className="font-bold text-[20px] text-one">Daftar</h1>
      <form
        onSubmit={form.onSubmit(handleSubmit)}
        className="flex flex-col items-center mt-[30px]">
        <GoogleAuthButton title="Daftar dengan google" />
        <div className="flex flex-col my-5 w-full">
          <Input
            label="Nama"
            id="name"
            type="text"
            value={form.values.name}
            errorLabel={form.errors.name as string}
            onChange={e => form.setFieldValue('name', e as string)}
            maxLength={30}
          />
          <Input
            label="Email"
            id="email"
            type="email"
            value={form.values.email}
            errorLabel={form.errors.email as string}
            onChange={e => form.setFieldValue('email', e as string)}
          />
          <Input
            label="Password"
            id="password"
            type="password"
            value={form.values.password}
            errorLabel={form.errors.password as string}
            onChange={e => form.setFieldValue('password', e as string)}
          />
        </div>
        <Button type="submit" isLoading={isLoading} className="text-white mt-4">
          Register
        </Button>
      </form>
      <div className="flex flex-col items-center justify-center gap-[10px] font-medium text-[14px] text-one mt-10">
        <p>Sudah punya akun ?</p>
        <Link href="/login" className="text-success">
          Masuk
        </Link>
      </div>
    </Layout>
  )
}