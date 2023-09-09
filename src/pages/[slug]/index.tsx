import * as React from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/templates/Layout'
import { PemiluDatas } from '@/interfaces/pemilu'
import fetchPemiluData from '@/utils/fetchPemiluData'
import getPageUrl from '@/utils/getPageUrl'
import usePemiluDatasSnapshot from '@/hooks/usePemiluDataSnapshot'
import Vote from '@/components/views/Vote'

export default function Index({ pemiluDatas }: { pemiluDatas: PemiluDatas }) {
  const router = useRouter()
  const { slug } = router.query
  const pemiluDatasUptodate = usePemiluDatasSnapshot(slug as string, pemiluDatas)

  return (
    <Layout isBackBtn title="Detail Pemilu">
      <Vote pemiluDatas={pemiluDatasUptodate} />
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
      pemiluDatas,
    },
  }
}
