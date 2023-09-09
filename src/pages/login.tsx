import React from 'react';
import { useRouter } from 'next/router';
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Layout from '@/components/templates/Layout'
import { isEmail, useForm } from '@mantine/form'
import { LoginFormType } from '@/types/auth'
import { AxiosErrorResponse } from '@/interfaces/axios'
import { signIn } from 'next-auth/react'
import GoogleAuthButton from '@/components/atoms/GoogleAuthButton'
import Link from 'next/link';
import { notifyError, notifyLoading, notifySuccess } from '@/components/molecules/Toast'

export default function Login() {
  const [isLoading, setIsLoading] = React.useState(false)
  const { query, push } = useRouter()

  const form = useForm<LoginFormType>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: isEmail('Email tidak valid.'),
      password: value => {
        if (value.length < 8) {
          return 'Password minimal 8 karakter.'
        }
        return null
      },
    },
  })

  const callbackUrl: any = query.callbackUrl || '/'

  const handleSubmit = async (value: LoginFormType) => {
    notifyLoading('Masuk diproses...', 'login')
    setIsLoading(true)
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: value.email,
        password: value.password,
        callbackUrl,
      })
      if (!res?.error) {
        notifySuccess('Berhasil masuk', 'login')
        setIsLoading(false)
        push(callbackUrl)
      } else {
        notifyError('Gagal masuk, periksa kembali email atau password', 'login')
        setIsLoading(false)
      }
    } catch (error) {
      const axiosError = error as AxiosErrorResponse
      notifyError('Gagal masuk', 'login')
      console.log(axiosError)
    }
    setIsLoading(false)
  }

  return (
    <Layout>
      <h1 className="font-bold text-[20px] text-one">Masuk</h1>
      <form
        onSubmit={form.onSubmit(handleSubmit)}
        className="flex flex-col items-center mt-[30px]">
        <GoogleAuthButton title="Masuk dengan google" />
        <div className="flex flex-col my-5 w-full">
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
          Masuk
        </Button>
      </form>
      <div className="flex flex-col items-center justify-center gap-[10px] font-medium text-[14px] text-one mt-10">
        <p>Belum punya akun ?</p>
        <Link href="/register" className="text-success">
          Daftar
        </Link>
      </div>
    </Layout>
  )
}
