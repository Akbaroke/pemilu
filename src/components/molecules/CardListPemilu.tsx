import { PemiluDatas } from '@/interfaces/pemilu'
import formatCustomDate from '@/utils/formatCustomDate'
import Image from 'next/image'
import Link from 'next/link'
import { BiTimer } from 'react-icons/bi'
import PEMILU_IMAGE from '@/assets/pemilu-image.png'

function CardListPemilu({ pemilu }: { pemilu: PemiluDatas }) {
  return (
    <Link
      href={`/${pemilu.slug}`}
      key={pemilu.slug}
      className="rounded-[10px] border border-two p-4 flex items-center gap-4 shadow-md hover:shadow-sm transition-all duration-300 cursor-pointer">
      <Image src={PEMILU_IMAGE} alt="image pemilu" className="w-[101px] h-[96px]" />
      <div className="flex flex-col justify-between gap-1">
        <h1 className="text-one text-[14px] font-semibold capitalize">{pemilu.name}</h1>
        <ul className="text-one text-[12px] font-medium leading-5">
          <li>{pemilu?.options?.length || 0} Kandidat</li>
          <li>
            {pemilu.options.flatMap(val =>
              val.voters ? val.voters.map(voter => voter.email) : []
            )?.length || 0}{' '}
            Pemilih
          </li>
        </ul>
        <div className="flex items-center gap-1 text-three text-[12px]">
          <BiTimer size={16} />
          {pemilu.started_at < new Date().getTime() ? (
            <p>Berakhir {formatCustomDate(new Date(pemilu.ended_at) || new Date())}</p>
          ) : (
            <p>Dimulai {formatCustomDate(new Date(pemilu.started_at) || new Date())}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default CardListPemilu
