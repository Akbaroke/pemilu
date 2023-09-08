import { useState, useEffect } from 'react'
import { onSnapshot, collection, query, where, getDocs } from 'firebase/firestore'
import { PemiluDatas } from '@/interfaces/pemilu'
import { firestore } from '@/lib/firebase/init'
import { useSession } from 'next-auth/react'

const useAllPemiluSnapshot = (pemiluDatas: PemiluDatas[]) => {
  const { data } = useSession()
  const email = data?.user?.email
  const [pemiluDatasUptodate, setPemiluDatasUptodate] =
    useState<PemiluDatas[]>(pemiluDatas)

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'pemilu'), async () => {
      const q = query(
        collection(firestore, 'pemilu'),
        where('emailUserCreated', '==', email)
      )
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      setPemiluDatasUptodate(data as unknown as PemiluDatas[])
    })

    return unsubscribe
  }, [email])

  return pemiluDatasUptodate
}

export default useAllPemiluSnapshot
