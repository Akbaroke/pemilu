import * as React from 'react'
import Button from '@/components/atoms/Button'
import Layout from '@/components/templates/Layout'
import KandidatForm from '@/components/organisms/KandidatForm'
import StepperCreatePemilu from '@/components/molecules/StepperCreatePemilu'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import cn from '@/utils/cn'
import BilikSuaraForm from '@/components/organisms/BilikSuaraForm'
import PreviewCreatePemilu from '@/components/organisms/PreviewCreatePemilu'
import DetailForm from '@/components/molecules/DetailForm'
import { Checkbox } from '@mantine/core'

export default function CretePemilu() {
  const [isChecked, setIsChecked] = React.useState(false)
  const [active, setActive] = React.useState(0)
  const [isKandidatsValid, setIsKandidatsValid] = React.useState(false)
  const { detail, kandidats, bilikSuara } = useSelector(
    (state: RootState) => state.CreatePemiluSlice
  )

  React.useEffect(() => {
    const checkKandidats = () => {
      let isValid = false
      if (active === 0) {
        detail?.isValid ? (isValid = true) : (isValid = false)
      } else if (active === 1) {
        kandidats.map(kandidat => {
          kandidat.isValid ? (isValid = true) : (isValid = false)
        })
      } else if (active === 2) {
        bilikSuara.map(bilikSuara => {
          bilikSuara.isValid ? (isValid = true) : (isValid = false)
        })
      } else {
        isChecked ? (isValid = true) : (isValid = false)
      }
      setIsKandidatsValid(isValid)
    }
    checkKandidats()
  }, [detail, kandidats, bilikSuara, active, isChecked])

  const ContentFrom = () => {
    switch (active) {
      case 0:
        return <DetailForm />
      case 1:
        return <KandidatForm />
      case 2:
        return <BilikSuaraForm />
      default:
        return <PreviewCreatePemilu />
    }
  }

  return (
    <Layout isBackBtn title="Buat Pemilu">
      <div className="flex flex-col gap-2">
        <StepperCreatePemilu active={active} setActive={setActive} />
        {ContentFrom()}
        <div
          className={cn('flex flex-col', {
            'gap-1 mt-4': active === 3,
          })}>
          {active === 3 ? (
            <Checkbox
              label="Saya yakin data ini sudah benar."
              checked={isChecked}
              onChange={e => setIsChecked(e.currentTarget.checked)}
              size="xs"
              color="dark"
            />
          ) : null}
          <Button
            className={cn('mt-5', {
              'opacity-70 shadow-none active:scale-100': !isKandidatsValid,
            })}
            isDisabled={!isKandidatsValid}
            onClick={() => setActive(active + 1)}>
            {active === 3 ? 'Selesai' : 'Selanjutnya'}
          </Button>
        </div>
      </div>
    </Layout>
  )
}
