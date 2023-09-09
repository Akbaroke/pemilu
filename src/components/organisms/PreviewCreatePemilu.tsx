import { RootState } from '@/redux/store'
import Image from 'next/image'
import React from 'react'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export default function PreviewCreatePemilu() {
  const { detail, kandidats } = useSelector((state: RootState) => state.CreatePemiluSlice)

  const formatDateTime = (tanggal?: Date) => {
    return tanggal ? format(tanggal, 'dd/MM/yyyy - HH:mm', { locale: id }) : ''
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="py-4 border-b sticky top-14 bg-white z-30">
        <h1 className="text-one font-bold text-[20px] capitalize">{detail?.name}</h1>
      </div>
      <div className="flex flex-col gap-5 border rounded-[10px] p-4">
        <div>
          <h1 className="font-medium text-[14px] text-one">Kandidat :</h1>
          <div className="flex flex-col gap-4 mt-3">
            {kandidats?.map(value => (
              <div key={value.id} className="flex items-center gap-4">
                <Image
                  src={value.image.url}
                  alt={value.name}
                  width={71}
                  height={71}
                  style={{ border: `4px solid ${value.color}`, borderRadius: '50%' }}
                  className="w-[71px] h-[71px]"
                />
                <div className="leading-2">
                  <h1 className="font-semibold text-[14px] text-one">{value.name}</h1>
                  <p className="font-medium text-[12px] text-one">Memperoleh 0 suara</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <h1 className="font-semibold text-[16px] text-one">Jadwal :</h1>
        <div className="mt-3 border rounded-[10px] p-4 text-[13px] leading-6">
          <p>
            Dimulai :{' '}
            {formatDateTime(new Date(detail?.started_at || new Date().getTime()))}
          </p>
          <p>
            Berakhir :{' '}
            {formatDateTime(new Date(detail?.ended_at || new Date().getTime()))}
          </p>
        </div>
      </div>
    </div>
  )
}
