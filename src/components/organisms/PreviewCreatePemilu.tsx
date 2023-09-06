import { RootState } from '@/redux/store'
import { Badge } from '@mantine/core'
import Image from 'next/image'
import React from 'react'
import { BiTimer } from 'react-icons/bi'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export default function PreviewCreatePemilu() {
  const { detail, kandidats, bilikSuara } = useSelector(
    (state: RootState) => state.CreatePemiluSlice
  )

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
        <h1 className="font-semibold text-[16px] text-one">Bilik Suara :</h1>
        <div className="mt-3 flex flex-col gap-3">
          {bilikSuara?.map(value => (
            <div className="border rounded-[10px] p-4" key={value.id}>
              <Badge color="green" className="w-max">
                Bilik {value.id}
              </Badge>
              <div className="flex justify-between items-center mt-3">
                <div className="flex flex-col justify-between gap-2">
                  <h1 className="font-medium text-[14px] text-one">Kosong ...</h1>
                  <div className="text-three font-normal text-[12px] flex items-center gap-1">
                    <BiTimer size={18} />
                    <p>Sisa waktu {value.timer} detik</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h1 className="font-semibold text-[16px] text-one">Jadwal :</h1>
        <div className="mt-3 border rounded-[10px] p-4 text-[13px] leading-6">
          <p>Dimulai : {formatDateTime(detail?.started_at)}</p>
          <p>Berakhir : {formatDateTime(detail?.ended_at)}</p>
        </div>
      </div>
    </div>
  )
}
