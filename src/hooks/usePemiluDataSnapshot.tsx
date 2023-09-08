import { useState, useEffect } from 'react'
import { onSnapshot, collection, query, where, getDocs } from 'firebase/firestore'
import { PemiluDatas } from '@/interfaces/pemilu'
import { firestore } from '@/lib/firebase/init'

const usePemiluDatasSnapshot = (slug: string, pemiluDatas: PemiluDatas) => {
  const [pemiluDatasUptodate, setPemiluDatasUptodate] = useState<PemiluDatas>(pemiluDatas)

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'pemilu'), async () => {
      const q = query(collection(firestore, 'pemilu'), where('slug', '==', slug))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      setPemiluDatasUptodate(data[0] as unknown as PemiluDatas)
    })

    return unsubscribe
  }, [slug])

  return pemiluDatasUptodate
}

export default usePemiluDatasSnapshot
