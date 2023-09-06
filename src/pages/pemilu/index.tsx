import * as React from 'react'
import Button from '@/components/atoms/Button'
import Layout from '@/components/templates/Layout'
import KandidatForm from '@/components/organisms/KandidatForm'
import StepperCreatePemilu from '@/components/molecules/StepperCreatePemilu'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import cn from '@/utils/cn'
import BilikSuaraForm from '@/components/organisms/BilikSuaraForm'
import PreviewCreatePemilu from '@/components/organisms/PreviewCreatePemilu'
import DetailForm from '@/components/molecules/DetailForm'
import { Checkbox } from '@mantine/core'
import { useSession } from 'next-auth/react'
import generateSlug from '@/utils/generateSlug'
import { OptionType, RoomType } from '@/types/pemilu'
import { useRouter } from 'next/router'
import { addDoc, collection } from 'firebase/firestore'
import { firestore, storage } from '@/lib/firebase/init'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { resetFormState } from '@/redux/slices/createPemiluSlice'

export default function CretePemilu() {
  const dispatch = useDispatch()
  const { data } = useSession()
  const { push } = useRouter()
  const [isChecked, setIsChecked] = React.useState<boolean>(false)
  const [active, setActive] = React.useState<number>(0)
  const [isKandidatsValid, setIsKandidatsValid] = React.useState<boolean>(false)
  const { detail, kandidats, bilikSuara } = useSelector(
    (state: RootState) => state.CreatePemiluSlice
  )

  React.useEffect(() => {
    const checkKandidats = () => {
      let isValid = false

      if (active === 0) {
        isValid = !!detail?.isValid
      } else if (active === 1) {
        isValid = kandidats.every(kandidat => !!kandidat.isValid)
      } else if (active === 2) {
        isValid = bilikSuara.every(bilik => !!bilik.isValid)
      } else {
        isValid = isChecked
      }

      setIsKandidatsValid(isValid)
    }
    checkKandidats()
  }, [detail, kandidats, bilikSuara, active, isChecked])

  React.useEffect(() => {
    return () => dispatch(resetFormState())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const handleCreatePemilu = async () => {
    console.log('klik')

    if (data?.user?.email && detail && kandidats && bilikSuara) {
      const slug = generateSlug()
      const uploadPromises: any[] = []
      const imageUrls: string[] = []

      kandidats.forEach(kandidat => {
        const storageRef = ref(storage, `kandidat/${slug}/${kandidat.id}.jpg`)

        const uploadPromise = uploadBytes(storageRef, kandidat.image.file)
          .then(snapshot => {
            return getDownloadURL(storageRef)
          })
          .then(downloadURL => {
            console.log(`File ${kandidat.id}.jpg berhasil diupload!`)
            imageUrls.push(downloadURL)
          })
          .catch(error => {
            console.error(`Error mengupload file ${kandidat.id}.jpg: `, error)
          })

        uploadPromises.push(uploadPromise)
      })

      try {
        await Promise.all(uploadPromises)

        const options: OptionType[] = kandidats.map((kandidat, index) => ({
          id: kandidat.id,
          name: kandidat.name,
          imageUrl: imageUrls[index],
          color: kandidat.color,
        }))

        const rooms: RoomType[] = bilikSuara.map(bilik => ({
          id: bilik.id,
          prepare: bilik.prepare,
          timer: bilik.timer,
        }))

        const dataPemilu = {
          emailUserCreated: data.user.email,
          slug: slug,
          name: detail.name,
          maxQueue: detail.maxQueue,
          started_at: detail.started_at,
          ended_at: detail.ended_at,
          options: options,
          rooms: rooms,
        }

        await addDoc(collection(firestore, 'pemilu'), dataPemilu)

        console.log({
          status: true,
          message: 'Berhasil membuat pemilu',
        })

        push('/')
        dispatch(resetFormState())
      } catch (error) {
        console.log({
          status: false,
          message: error,
        })
      }
    }
  }

  return (
    <Layout isBackBtn title="Buat Pemilu">
      <div className="flex flex-col gap-5">
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
            className="mt-5"
            isDisabled={!isKandidatsValid}
            onClick={() => (active === 3 ? handleCreatePemilu() : setActive(active + 1))}>
            {active === 3 ? 'Selesai' : 'Selanjutnya'}
          </Button>
        </div>
      </div>
    </Layout>
  )
}