import * as React from 'react'
import Image from 'next/image'
import { BiTimer } from 'react-icons/bi'
import Button from '../atoms/Button'
import PEMILU_IMAGE from '@/assets/pemilu-image.png'
import { PemiluDatas } from '@/interfaces/pemilu'
import formatCustomDate from '@/utils/formatCustomDate'
import usePemiluDatasSnapshot from '@/hooks/usePemiluDataSnapshot'
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { firestore } from '@/lib/firebase/init'
import { useSession } from 'next-auth/react'
import Timer from '../molecules/Timer'

type StepperViewProps = {
  pemiluDatas: PemiluDatas
  nextStep?: () => void
  backStep?: () => void
}

export default function Vote({ pemiluDatas }: { pemiluDatas: PemiluDatas }) {
  const { data } = useSession()
  const [step, setStep] = React.useState<number>(1)
  const pemiluDatasUptodate = usePemiluDatasSnapshot(
    pemiluDatas.slug as string,
    pemiluDatas
  )

  const nextStep = () => setStep(step + 1)
  const backStep = () => setStep(step - 1)

  switch (step) {
    case 1:
      return <PreQueue pemiluDatas={pemiluDatasUptodate} nextStep={nextStep} />
    case 2:
      return <Queue pemiluDatas={pemiluDatasUptodate} backStep={backStep} />
    default:
      return <PreQueue pemiluDatas={pemiluDatasUptodate} nextStep={nextStep} />
  }
}

function PreQueue({ pemiluDatas, nextStep }: StepperViewProps) {
  const { data } = useSession()
  const [isLoading, setIsLoading] = React.useState(false)

  const handleMasukAntrian = async () => {
    try {
      setIsLoading(true)

      const q = query(
        collection(firestore, 'pemilu'),
        where('slug', '==', pemiluDatas.slug)
      )
      const docSnap = await getDocs(q)
      const id = docSnap.docs[0].id

      const pemiluRef = doc(firestore, 'pemilu', id)
      const newQueueItem = {
        email: data?.user?.email,
        name: data?.user?.name,
      }
      await setDoc(
        pemiluRef,
        {
          queue: pemiluDatas.queue
            ? [...pemiluDatas.queue, newQueueItem]
            : [newQueueItem],
        },
        { merge: true }
      )

      console.log({
        status: true,
        message: 'Berhasil masuk ke antrian',
      })
      nextStep && nextStep()
    } catch (error) {
      console.log({
        status: false,
        message: 'Gagal masuk ke antrian',
        error: error,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h1 className="font-bold text-[20px] text-one">Daftar Antrian</h1>
      <div className="border rounded-[10px] p-5 flex flex-col gap-5 mt-4">
        <div className="flex items-center gap-4">
          <Image src={PEMILU_IMAGE} alt="image pemilu" className="w-[101px] h-[96px]" />
          <div className="flex flex-col justify-between gap-1">
            <h1 className="text-one text-[14px] font-semibold">{pemiluDatas.name}</h1>
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
          onClick={handleMasukAntrian}
          isLoading={isLoading}>
          Masuk Antrian
        </Button>
      </div>
    </div>
  )
}

function Queue({ pemiluDatas, backStep }: StepperViewProps) {
  const { data } = useSession()
  const [isLoading, setIsLoading] = React.useState(false)
  const [numberPosision, setNumberPosision] = React.useState(1)

  React.useEffect(() => {
    pemiluDatas.queue?.flatMap((value, index) => {
      if (value.email === data?.user?.email) {
        setNumberPosision(index + 1)
      }
    })
  }, [data?.user?.email, pemiluDatas])

  const handleKeluarAntrian = async () => {
    try {
      setIsLoading(true)
      await OutQueue(pemiluDatas, data?.user?.email as string)
      console.log({
        status: true,
        message: 'Berhasil keluar ke antrian',
      })
      backStep && backStep()
    } catch (error) {
      console.log({
        status: false,
        message: 'Gagal keluar ke antrian',
        error: error,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h1 className="font-bold text-[20px] text-one">Daftar Antrian</h1>
      <div className="border rounded-[10px] p-5 flex flex-col gap-4 items-center text-center mt-4">
        <div className="flex flex-col justify-center items-center leading-8">
          <h2 className="font-medium text-[14px] text-one">Antrian</h2>
          <h1 className="font-bold text-[32px] text-one">
            {numberPosision}/{pemiluDatas.queue?.length}
          </h1>
          <div className="flex items-center gap-1 text-three text-[12px]">
            <BiTimer size={16} />
            <Timer />
          </div>
        </div>
        <p className="font-medium text-[12px] text-one px-3">
          Mohon bersabar antrian akan segera berakhir. Setelah antrian selesai anda akan
          langsung diarahkan ke dalam bilik suara.
        </p>
        <Button
          className="text-white my-5"
          onClick={handleKeluarAntrian}
          isLoading={isLoading}>
          Keluar Antrian
        </Button>
      </div>
    </div>
  )
}

const OutQueue = async (pemiluDatas: PemiluDatas, email: string) => {
  const q = query(collection(firestore, 'pemilu'), where('slug', '==', pemiluDatas.slug))
  const docSnap = await getDocs(q)
  const id = docSnap.docs[0].id

  const pemiluRef = doc(firestore, 'pemilu', id)
  const newQueueItem = pemiluDatas.queue?.filter(item => item.email !== email)

  await setDoc(pemiluRef, { queue: newQueueItem }, { merge: true })
}
