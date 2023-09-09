import * as React from 'react'
import Button from '../atoms/Button'
import { useRouter } from 'next/router'
import useCountdown from '@/hooks/useCountdown'

export default function LayerPrepare({
  prepare,
  limit,
}: {
  prepare: number
  limit: number
}) {
  const { push } = useRouter()

  return (
    <div className="absolute z-50 right-0 left-0 top-0 bottom-0 bg-one/50 backdrop-blur-sm grid place-items-center p-8">
      <div className="bg-white p-7 flex flex-col gap-7 rounded-[10px]">
        <div className="text-center leading-10">
          <p className="font-medium text-[14px] text-one">Persiapan</p>
          <h1 className="text-one font-bold text-[40px] animate-ping">{prepare}</h1>
        </div>
        <p className="text-center font-medium text-one text-[12px]">
          Persiapkan dirimu untuk memilih kandidat. Waktu yang kamu miliki atau batas
          waktu memilih hanya <b>{limit} detik</b>.
        </p>
        <Button className="w-max m-auto bg-danger" onClick={() => push('/')}>
          Keluar
        </Button>
      </div>
    </div>
  )
}
