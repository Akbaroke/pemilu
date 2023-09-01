import * as React from 'react'
import Button from '@/components/atoms/Button'
import Layout from '@/components/templates/Layout'
import KandidatForm from '@/components/organisms/KandidatForm'
import StepperCreatePemilu from '@/components/molecules/StepperCreatePemilu'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import cn from '@/utils/cn'

export default function CretePemilu() {
  const [active, setActive] = React.useState(0)
  const [isKandidatsValid, setIsKandidatsValid] = React.useState(false)
  const { kandidats } = useSelector((state: RootState) => state.CreatePemiluSlice)

  React.useEffect(() => {
    const checkKandidats = () => {
      let isValid = false
      kandidats.map(kandidat => {
        kandidat.isValid ? (isValid = true) : (isValid = false)
      })
      setIsKandidatsValid(isValid)
    }
    checkKandidats()
  }, [kandidats])

  return (
    <Layout isBackBtn title="Buat Pemilu">
      <div className="flex flex-col gap-10">
        <StepperCreatePemilu active={active} setActive={setActive} />
        <KandidatForm />
        <Button
          className={cn('mt-5')}
          color={isKandidatsValid ? '#fff' : '#000'}
          onClick={() => setActive(active + 1)}>
          Lanjutan
        </Button>
      </div>
    </Layout>
  )
}
