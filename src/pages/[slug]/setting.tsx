import * as React from 'react'
import DetailForm from '@/components/molecules/DetailForm'
import Layout from '@/components/templates/Layout'
import fetchPemiluData from '@/utils/fetchPemiluData'
import getPageUrl from '@/utils/getPageUrl'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { PemiluDatas } from '@/interfaces/pemilu'
import Button from '@/components/atoms/Button'
import { RootState } from '@/redux/store'
import { resetFormState } from '@/redux/slices/createPemiluSlice'
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { firestore } from '@/lib/firebase/init'

export default function Setting({ pemiluDatas }: { pemiluDatas: PemiluDatas }) {
  const router = useRouter()
  const dispatch = useDispatch()
  const { slug } = router.query
  const { detail } = useSelector((state: RootState) => state.CreatePemiluSlice)
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    return () => dispatch(resetFormState())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleUpdateDetail = async () => {
    try {
      setIsLoading(true)
      const q = query(collection(firestore, 'pemilu'), where('slug', '==', slug))
      const docSnap = await getDocs(q)
      const id = docSnap.docs[0].id

      const pemiluRef = doc(firestore, 'pemilu', id)
      const dataPemilu = {
        name: detail?.name,
        maxQueue: detail?.maxQueue,
        started_at: detail?.started_at,
        ended_at: detail?.ended_at,
      }
      await setDoc(pemiluRef, dataPemilu, { merge: true })

      console.log({
        status: true,
        message: 'Berhasil update pengaturan pemilu',
      })

      router.back()
    } catch (error) {
      console.log({
        status: false,
        message: 'Gagal update pengaturan pemilu',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout isBackBtn title="Pengaturan">
      <DetailForm
        DetailValues={{
          name: pemiluDatas.name,
          maxQueue: pemiluDatas.maxQueue,
          started_at: pemiluDatas.started_at,
          ended_at: pemiluDatas.ended_at,
        }}
      />
      <div className="mt-10 flex justify-center">
        <Button
          isDisabled={!detail?.isValid}
          onClick={handleUpdateDetail}
          isLoading={isLoading}>
          Simpan
        </Button>
      </div>
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
