import * as React from 'react'
import Image from 'next/image'
import { GiVote } from 'react-icons/gi'
import Button from '../atoms/Button'
import { PemiluDatas } from '@/interfaces/pemilu'
import formatCustomDate from '@/utils/formatCustomDate'
import usePemiluDatasSnapshot from '@/hooks/usePemiluDataSnapshot'
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { firestore } from '@/lib/firebase/init'
import { useSession } from 'next-auth/react'
import Timer from '../molecules/Timer'
import RadioCheck from '../atoms/RadioCheck'
import cn from '@/utils/cn'
import DashboardResult from './DashboardResult'
import { notifyError, notifyLoading, notifySuccess } from '../molecules/Toast'

type StepperViewProps = {
  pemiluDatas: PemiluDatas
  nextStep?: () => void
  backStep?: () => void
}

export default function Vote({ pemiluDatas }: { pemiluDatas: PemiluDatas }) {
  const [step, setStep] = React.useState<number>(1)
  const pemiluDatasUptodate = usePemiluDatasSnapshot(
    pemiluDatas.slug as string,
    pemiluDatas
  )

  const nextStep = () => setStep(step + 1)
  const backStep = () => setStep(step - 1)

  switch (step) {
    case 1:
      return <DashboardResult pemiluDatas={pemiluDatasUptodate} nextStep={nextStep} />
    case 2:
      return <Voted pemiluDatas={pemiluDatasUptodate} backStep={backStep} />
  }
}

function Voted({ pemiluDatas, backStep }: StepperViewProps) {
  const { data } = useSession()
  const [isLoading, setIsLoading] = React.useState(false)
  const [kandidatSelected, setKandidatSelected] = React.useState<string>('')

  const handleSaveKandidatSelected = async () => {
    notifyLoading('Simpan diproses...', 'vote')
    try {
      setIsLoading(true)

      const q = query(
        collection(firestore, 'pemilu'),
        where('slug', '==', pemiluDatas.slug)
      )
      const docSnap = await getDocs(q)
      const id = docSnap.docs[0].id

      const pemiluRef = doc(firestore, 'pemilu', id)
      const newUpdate = {
        options: pemiluDatas.options.map(val => {
          if (val.id === kandidatSelected) {
            return {
              ...val,
              voters: val.voters
                ? [
                    ...val.voters,
                    {
                      email: data?.user?.email,
                      name: data?.user?.name,
                      time: new Date().getTime(),
                    },
                  ]
                : [
                    {
                      email: data?.user?.email,
                      name: data?.user?.name,
                      time: new Date().getTime(),
                    },
                  ],
            }
          }
          return val
        }),
      }
      await setDoc(pemiluRef, newUpdate, { merge: true })
      notifySuccess('Berhasil menyimpan pilihan', 'vote')
      backStep && backStep()
    } catch (error) {
      notifyError('Gagal menyimpan pilihan', 'vote')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h1 className="font-bold text-[20px] text-one capitalize">{pemiluDatas.name}</h1>
      <div className="flex flex-col gap-2 mt-4">
        {pemiluDatas.options.map((val, index) => (
          <div
            className={cn(
              'border rounded-[10px] py-3 px-4 flex items-center gap-4 transition-all duration-300',
              {
                'border-success': val.id === kandidatSelected,
                'cursor-pointer': val.id !== kandidatSelected,
              }
            )}
            onClick={() => setKandidatSelected(val.id)}
            key={index}>
            <Image
              src={val.imageUrl}
              alt={val.name}
              width={71}
              height={71}
              style={{ border: `4px solid ${val.color}`, borderRadius: '50%' }}
              className="w-[71px] h-[71px]"
            />
            <div className="flex justify-between items-center flex-1">
              <div className="leading-2">
                <h1 className="font-semibold text-[14px] text-one">{val.name}</h1>
                <p className="font-medium text-[12px] text-one">
                  Memperoleh {val.voters ? val.voters.length : 0} suara
                </p>
              </div>
              <RadioCheck isActive={val.id === kandidatSelected} />
            </div>
          </div>
        ))}
      </div>
      <Button
        icon={<GiVote />}
        className="m-auto mt-14"
        isLoading={isLoading}
        isDisabled={!kandidatSelected}
        onClick={handleSaveKandidatSelected}>
        Simpan
      </Button>
    </div>
  )
}
