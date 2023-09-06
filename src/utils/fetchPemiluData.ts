import { getSession } from 'next-auth/react'
import { getPemiluBySlug } from '@/lib/firebase/service'

export default async function fetchPemiluData(slug: string, req: any) {
  const session = await getSession({ req })
  const pemiluDatas: any = await getPemiluBySlug(slug)

  return { session, pemiluDatas }
}
