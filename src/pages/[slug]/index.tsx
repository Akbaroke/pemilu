import * as React from 'react'
import { useRouter } from 'next/router'
import { Chart } from 'primereact/chart'
import Image from 'next/image'
import CopyBtn from '@/components/atoms/CopyBtn'
import Layout from '@/components/templates/Layout'
import { Badge, Loader } from '@mantine/core'
import { BiTimer } from 'react-icons/bi'
import { VscDebugDisconnect } from 'react-icons/vsc'
import { IoMdSettings } from 'react-icons/io'
import PEMILU_IMAGE from '@/assets/pemilu-image.png'
import formatCustomDate from '@/utils/formatCustomDate'
import Button from '@/components/atoms/Button'
import { PemiluDatas } from '@/interfaces/pemilu'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import fetchPemiluData from '@/utils/fetchPemiluData'
import getPageUrl from '@/utils/getPageUrl'
import cn from '@/utils/cn'

export default function Index({ pemiluDatas }: { pemiluDatas: PemiluDatas }) {
  const router = useRouter()
  const { slug } = router.query
  const { data } = useSession()
  const [chartData, setChartData] = React.useState({})
  const [chartOptions, setChartOptions] = React.useState({})
  const [isVotes, setIsVotes] = React.useState(false)

  React.useEffect(() => {
    if (pemiluDatas) {
      const data = {
        labels: pemiluDatas.options.map(val => val.name),
        datasets: [
          {
            data: pemiluDatas.options.map(val => (val.votes ? val.votes.length : 0)),
            label: 'Jumlah Suara',
            backgroundColor: pemiluDatas.options.map(val => val.color),
            hoverOffset: 4,
          },
        ],
      }
      const options = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
            },
          },
        },
      }

      setChartData(data)
      setChartOptions(options)
    }
    pemiluDatas.options.map(val => (val.votes ? setIsVotes(true) : setIsVotes(false)))
  }, [pemiluDatas])

  const CreaterPage = () => (
    <div className="flex flex-col gap-[25px]">
      <h1 className="font-bold text-[20px] text-one">{pemiluDatas.name}</h1>
      <div className="flex flex-col gap-5 border rounded-[10px] p-5">
        {isVotes ? (
          <div>
            <h1 className="font-medium text-[14px] text-one">
              Hasil pemilihan sementara :
            </h1>
            <Chart
              type="pie"
              data={chartData}
              options={chartOptions}
              className="w-full sm:w-[250px] m-auto mt-3"
            />
          </div>
        ) : null}

        <div>
          <h1 className="font-medium text-[14px] text-one">Kandidat :</h1>
          <div className="flex flex-col gap-4 mt-3">
            {pemiluDatas.options?.map(value => (
              <div key={value.id} className="flex items-center gap-4">
                <Image
                  src={value.imageUrl}
                  alt={value.name}
                  width={71}
                  height={71}
                  style={{ border: `4px solid ${value.color}`, borderRadius: '50%' }}
                  className="w-[71px] h-[71px]"
                />
                <div className="leading-2">
                  <h1 className="font-semibold text-[14px] text-one">{value.name}</h1>
                  <p className="font-medium text-[12px] text-one">
                    Memperoleh {value.votes ? value.votes.length : 0} suara
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border rounded-[10px] p-5 leading-6">
        <h1 className="font-medium text-[14px] text-one">Bagikan tautan :</h1>
        <p className="font-normal text-[12px] text-three">
          Tautan ini berfungsi untuk melakukan pemilihan.
        </p>
        <div className="h-[48px] px-[14px] flex items-center justify-between bg-two shadow-inner rounded-[5px] mt-2">
          <p className="text-[12px] font-normal text-one">{window.location.href}</p>
          <CopyBtn url={window.location.href} />
        </div>
      </div>
      <div>
        <h1 className="font-semibold text-[16px] text-one">Bilik Suara :</h1>
        <div className="mt-3 flex flex-col gap-3">
          {pemiluDatas.rooms?.map(value => (
            <div className="border rounded-[10px] p-5" key={value.id}>
              <Badge color="green" className="w-max">
                Bilik {value.id}
              </Badge>
              <div
                className={cn('mt-3', {
                  'flex justify-between items-center': !!value.userActive,
                })}>
                <div className="flex flex-col justify-between gap-2">
                  {value.userActive ? (
                    <h1 className="font-medium text-[14px] text-one">
                      {value.userActive?.name}
                    </h1>
                  ) : (
                    <div className="flex items-center justify-center mb-4 mt-1">
                      <Loader style={{ fill: '#000' }} variant="dots" size="sm" />
                    </div>
                  )}
                  <div className="text-three font-normal text-[12px] flex items-center gap-1">
                    <BiTimer size={18} />
                    <p>
                      {value.userActive
                        ? 'Sisa waktu 1 menit 3 detik'
                        : `Batas waktu habis ${value.timer} s`}
                    </p>
                  </div>
                </div>
                {value.userActive ? (
                  <div className="bg-[#CA3030]/25 w-[35px] h-[35px] rounded-[5px] grid place-items-center cursor-pointer shadow-md transition-all hover:shadow-sm">
                    <VscDebugDisconnect size={20} color="#CA3030" />
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
      {pemiluDatas.queue ? (
        <div className="border rounded-[10px] p-5 leading-6">
          <h1 className="font-medium text-[14px] text-one">Antrian Pemilih :</h1>
          <div className="leading-7 pl-2 mt-1">
            {pemiluDatas.queue.map((value, index) => (
              <p key={value.id} className="font-medium text-[14px] text-one">
                {index + 1}
                {`. `}
                {value.name}
              </p>
            ))}
          </div>
        </div>
      ) : null}
      <Link
        href={`/${slug}/setting`}
        className="border rounded-[10px] p-5 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md transition-all duration-300">
        <h1 className="font-medium text-[14px] text-one">Pengaturan</h1>
        <IoMdSettings size={17} />
      </Link>
    </div>
  )

  const VotePage = () => (
    <div>
      <h1 className="font-bold text-[20px] text-one">Daftar Antrian</h1>
      <div className="border rounded-[10px] p-5 flex flex-col gap-5 mt-4">
        <div className="flex items-center gap-4">
          <Image src={PEMILU_IMAGE} alt="image pemilu" className="w-[101px] h-[96px]" />
          <div className="flex flex-col justify-between gap-1">
            <h1 className="text-one text-[14px] font-semibold">{pemiluDatas?.name}</h1>
            <ul className="text-one text-[12px] font-medium leading-5">
              <li>{pemiluDatas.options ? pemiluDatas.options.length : 0} Pilihan</li>
              <li>{pemiluDatas.rooms ? pemiluDatas.rooms.length : 0} Bilik Suara</li>
              <li>{pemiluDatas.queue ? pemiluDatas.queue.length : 0} Antrian</li>
            </ul>
            <div className="flex items-center gap-1 text-three text-[12px]">
              <BiTimer size={16} />
              <p>
                Berakhir{' '}
                {formatCustomDate(new Date(pemiluDatas.started_at) || new Date())}
              </p>
            </div>
          </div>
        </div>
        <Button
          className="text-white w-max m-auto my-2"
          onClick={() => router.push(`/queue/${pemiluDatas.slug}`)}>
          Masuk Antrian
        </Button>
      </div>
    </div>
  )

  return (
    <Layout isBackBtn title="Detail Pemilu">
      {pemiluDatas.emailUserCreated === data?.user?.email ? (
        <CreaterPage />
      ) : (
        <VotePage />
      )}
    </Layout>
  )
}

export async function getServerSideProps(context: { query: { slug: string } } | any) {
  const { slug } = context.query
  const { req } = context

  const url = getPageUrl(slug, req)
  const { session, pemiluDatas } = await fetchPemiluData(slug, req)

  if (!pemiluDatas) {
    return {
      notFound: true,
    }
  }

  if (!session) {
    return {
      redirect: {
        destination: `/login?callbackUrl=${encodeURIComponent(url)}`,
        permanent: false,
      },
    }
  }

  return {
    props: {
      pemiluDatas:
        {
          ...pemiluDatas,
          started_at: pemiluDatas.started_at,
          ended_at: pemiluDatas.ended_at,
        } || '',
    },
  }
}
