import * as React from 'react';
import SearchInput from '@/components/atoms/SearchInput'
import PEMILU_IMAGE from '@/assets/pemilu-image.png';
import Image from 'next/image';
import { BiTimer } from 'react-icons/bi';
import { FiPlus } from 'react-icons/fi';
import formatCustomDate from '@/utils/formatCustomDate';
import Link from 'next/link';
import Layout from '@/components/templates/Layout'
import { Tooltip } from '@mantine/core'
import { getMyPemilu } from '@/lib/firebase/service'
import { PemiluDatas } from '@/interfaces/pemilu'
import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextApiRequest, NextPageContext } from 'next'

interface Pemilu {
  id: string
  slug: string
  usercreated_id: string
  name: string
  start: Date
  end: Date
  optionCount: number
  roomCount: number
  queueCount: number
}

const data: Pemilu[] = [
  {
    id: '1',
    slug: 'ABCD',
    usercreated_id: '1',
    name: 'Pemilihan Ketua RT 08',
    start: new Date(),
    end: new Date(),
    optionCount: 3,
    roomCount: 1,
    queueCount: 0,
  },
  {
    id: '2',
    slug: 'EFGH',
    usercreated_id: '2',
    name: 'Pemilihan Ketua RT 08',
    start: new Date(),
    end: new Date(),
    optionCount: 3,
    roomCount: 1,
    queueCount: 0,
  },
]

interface ListPemilu extends PemiluDatas {
  id: string
}

export default function Home({ listPemilu }: { listPemilu: ListPemilu[] }) {
  return (
    <Layout isLogoutBtn>
      <SearchInput placeholder="Cari.." />
      <div className="flex flex-col gap-3 mt-5">
        <Tooltip label="Buat Pemilu" withArrow position="bottom">
          <Link
            href="/pemilu"
            className="rounded-[10px] border border-dashed border-two p-[15px] flex items-center justify-center gap-4 hover:shadow-md transition-all duration-300 cursor-pointer text-three">
            <FiPlus size={30} />
          </Link>
        </Tooltip>
        {listPemilu?.map(pemilu => (
          <Link
            href={`/${pemilu.slug}`}
            key={pemilu.id}
            className="rounded-[10px] border border-two p-4 flex items-center gap-4 shadow-md hover:shadow-sm transition-all duration-300 cursor-pointer">
            <Image src={PEMILU_IMAGE} alt="image pemilu" className="w-[101px] h-[96px]" />
            <div className="flex flex-col justify-between gap-1">
              <h1 className="text-one text-[14px] font-semibold">{pemilu.name}</h1>
              <ul className="text-one text-[12px] font-medium leading-5">
                <li>{pemilu?.options?.length || 0} Pilihan</li>
                <li>{pemilu?.rooms?.length || 0} Bilik Suara</li>
                <li>{pemilu?.queue?.length || 0} Antrian</li>
              </ul>
              <div className="flex items-center gap-1 text-three text-[12px]">
                <BiTimer size={16} />
                <p>
                  Berakhir {formatCustomDate(new Date(pemilu.started_at) || new Date())}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  )
}

export async function getServerSideProps(context: NextPageContext) {
  const { req } = context as unknown as { req: NextApiRequest }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })
  const listPemilu = await getMyPemilu(token?.email as string)

  return {
    props: {
      listPemilu: listPemilu.map((pemilu: any) => ({
        ...pemilu,
        started_at: pemilu.started_at,
        ended_at: pemilu.ended_at,
      })),
    },
  }
}