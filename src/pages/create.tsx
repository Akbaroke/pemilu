import * as React from 'react'
import Button from '@/components/atoms/Button'
import Layout from '@/components/templates/Layout'
import KandidatForm from '@/components/organisms/KandidatForm'
import StepperCreatePemilu from '@/components/molecules/StepperCreatePemilu'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import cn from '@/utils/cn'
import PreviewCreatePemilu from '@/components/organisms/PreviewCreatePemilu'
import DetailForm from '@/components/molecules/DetailForm'
import { Checkbox } from '@mantine/core'
import { useSession } from 'next-auth/react'
import generateSlug from '@/utils/generateSlug'
import { OptionType } from '@/types/pemilu'
import { useRouter } from 'next/router'
import { addDoc, collection } from 'firebase/firestore'
import { firestore, storage } from '@/lib/firebase/init'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { resetFormState } from '@/redux/slices/createPemiluSlice'
import { notifyError, notifyLoading, notifySuccess } from '@/components/molecules/Toast'
import { getToken } from 'next-auth/jwt'
import { NextApiRequest, NextPageContext } from 'next'
import { getMyPemilu } from '@/lib/firebase/service'

export default function Create() {
  const dispatch = useDispatch()
  const { data } = useSession()
  const { push } = useRouter()
  const [isChecked, setIsChecked] = React.useState<boolean>(false)
  const [active, setActive] = React.useState<number>(0)
  const [isKandidatsValid, setIsKandidatsValid] = React.useState<boolean>(false)
  const { detail, kandidats } = useSelector((state: RootState) => state.CreatePemiluSlice)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkKandidats = () => {
      let isValid = false

      if (active === 0) {
        isValid = !!detail?.isValid
      } else if (active === 1) {
        isValid = kandidats.every(kandidat => !!kandidat.isValid)
      } else {
        isValid = isChecked
      }

      setIsKandidatsValid(isValid)
    }
    checkKandidats()
  }, [detail, kandidats, active, isChecked])

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
      default:
        return <PreviewCreatePemilu />
    }
  }

  const handleCreatePemilu = async () => {
    notifyLoading('Buat diproses...', 'create')
    setIsLoading(true)

    if (data?.user?.email && detail && kandidats) {
      const slug = generateSlug()
      const uploadPromises: any[] = []
      const imageUrls: {
        id: string
        url: string
      }[] = []

      kandidats.forEach(kandidat => {
        const id = kandidat.id
        const storageRef = ref(storage, `kandidat/${slug}/${id}.jpg`)

        const uploadPromise = uploadBytes(storageRef, kandidat.image.file)
          .then(snapshot => {
            return getDownloadURL(storageRef)
          })
          .then(downloadURL => {
            imageUrls.push({
              id: id,
              url: downloadURL,
            })
          })
          .catch(error => {
            console.error(`Error mengupload file ${id}.jpg: `, error)
          })

        uploadPromises.push(uploadPromise)
      })

      try {
        await Promise.all(uploadPromises)

        const options: OptionType[] = kandidats.map(kandidat => {
          const imageUrlObject = imageUrls.find(val => val.id === kandidat.id)
          const imageUrl = imageUrlObject ? imageUrlObject.url : ''

          return {
            id: kandidat.id,
            name: kandidat.name,
            imageUrl: imageUrl,
            color: kandidat.color,
          }
        })


        const dataPemilu = {
          emailUserCreated: data.user.email,
          slug: slug,
          name: detail.name,
          maxVoters: detail.maxVoters,
          prepareTime: detail.prepareTime,
          limitTime: detail.limitTime,
          started_at: detail.started_at,
          ended_at: detail.ended_at,
          options: options,
        }

        await addDoc(collection(firestore, 'pemilu'), dataPemilu)
        notifySuccess('Berhasil membuat pemilu', 'create')
        await push('/')
        dispatch(resetFormState())
      } catch (error) {
        notifyError('Gagal membuat pemilu', 'create')
      } finally {
        setIsLoading(false)
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
            'gap-1 mt-4': active === 2,
          })}>
          {active === 2 ? (
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
            isLoading={isLoading}
            onClick={() => (active === 2 ? handleCreatePemilu() : setActive(active + 1))}>
            {active === 2 ? 'Selesai' : 'Selanjutnya'}
          </Button>
        </div>
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

  if (listPemilu.length >= 3) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
