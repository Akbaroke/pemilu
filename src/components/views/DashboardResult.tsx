import * as React from 'react'
import Link from 'next/link'
import { IoMdSettings } from 'react-icons/io'
import CopyBtn from '../atoms/CopyBtn'
import Image from 'next/image'
import { Chart } from 'primereact/chart'
import { PemiluDatas } from '@/interfaces/pemilu'
import Button from '../atoms/Button'
import { VotersType } from '@/types/pemilu'
import { useSession } from 'next-auth/react'
import { Tooltip } from '@mantine/core'

type Props = {
  pemiluDatas: PemiluDatas
  nextStep?: () => void
}

export default function DashboardResult({ pemiluDatas, nextStep }: Props) {
  const { data } = useSession()
  const [chartData, setChartData] = React.useState({})
  const [chartOptions, setChartOptions] = React.useState({})
  const [allVoters, setAllVoters] = React.useState<VotersType[]>([])
  const [isAlReadyVoted, setIsAlReadyVoted] = React.useState(false)
  const [errorDisableVoteBtn, setErrorDisableVoteBtn] = React.useState('Tunggu...')
  const [url, setUrl] = React.useState('')

  React.useEffect(() => {
    if (pemiluDatas) {
      const data = {
        labels: pemiluDatas.options.map(val => val.name),
        datasets: [
          {
            data: pemiluDatas.options.map(val => (val.voters ? val.voters.length : 0)),
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

    let voters: any[] = []
    pemiluDatas.options.map(val =>
      val.voters
        ? val.voters.map(voter =>
            voters.push({
              email: voter.email,
              name: voter.name,
              time: voter.time,
            })
          )
        : null
    )
    setAllVoters(voters)
    setUrl(window.location.href)
  }, [pemiluDatas])

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (pemiluDatas.started_at >= new Date().getTime()) {
        setErrorDisableVoteBtn('Pemilu belum dimulai.')
      } else if (pemiluDatas.ended_at <= new Date().getTime()) {
        setErrorDisableVoteBtn('Pemilu sudah berakhir.')
      } else if (allVoters.length > pemiluDatas.maxVoters) {
        setErrorDisableVoteBtn('Pemilu sudah penuh.')
      } else {
        setErrorDisableVoteBtn('')
      }
    }, 500)

    return () => clearInterval(interval)
  }, [allVoters, pemiluDatas])

  React.useEffect(() => {
    const userEmail = data?.user?.email
    const query = allVoters.find(val => val.email === userEmail)
    if (query?.email === userEmail) {
      setIsAlReadyVoted(true)
    }
  }, [allVoters, data?.user?.email])

  return (
    <div className="flex flex-col gap-[25px]">
      <h1 className="font-bold text-[20px] text-one capitalize">{pemiluDatas.name}</h1>
      <div className="flex flex-col gap-5 border rounded-[10px] p-5">
        {allVoters.length > 0 ? (
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
                  <h1 className="font-semibold text-[14px] text-one capitalize">
                    {value.name}
                  </h1>
                  <p className="font-medium text-[12px] text-one">
                    Memperoleh {value.voters ? value.voters.length : 0} suara
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {!isAlReadyVoted ? (
        <Tooltip
          label={errorDisableVoteBtn}
          withArrow
          position="bottom"
          disabled={errorDisableVoteBtn.length === 0}>
          <div>
            <Button
              className="h-[60px] w-full"
              onClick={nextStep}
              isDisabled={errorDisableVoteBtn.length > 0}>
              Pilih Sekarang
            </Button>
          </div>
        </Tooltip>
      ) : null}
      <div className="border rounded-[10px] p-5 leading-6">
        <h1 className="font-medium text-[14px] text-one">Bagikan tautan :</h1>
        <p className="font-normal text-[12px] text-three">
          Tautan ini berfungsi untuk melakukan pemilihan.
        </p>
        <div className="h-[48px] px-[14px] flex items-center justify-between bg-two shadow-inner rounded-[5px] mt-2">
          <p className="text-[12px] font-normal text-one">{url}</p>
          <CopyBtn url={url} />
        </div>
      </div>
      {allVoters.length > 0 ? (
        <div className="border rounded-[10px] p-5 leading-6">
          <h1 className="font-medium text-[14px] text-one">Daftar Pemilih :</h1>
          <div className="leading-7 pl-2 mt-1">
            {allVoters
              .sort((a, b) => a.time - b.time)
              .map((value, index) => (
                <p key={index} className="font-medium text-[14px] text-one">
                  {index + 1}
                  {`. `}
                  {value.name}
                </p>
              ))}
          </div>
        </div>
      ) : null}
      {pemiluDatas.emailUserCreated === data?.user?.email ? (
        <Link
          href={`/${pemiluDatas.slug}/setting`}
          className="border rounded-[10px] p-5 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md transition-all duration-300">
          <h1 className="font-medium text-[14px] text-one">Pengaturan</h1>
          <IoMdSettings size={17} />
        </Link>
      ) : null}
    </div>
  )
}
