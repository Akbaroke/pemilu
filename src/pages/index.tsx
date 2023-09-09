import * as React from 'react'
import SearchInput from '@/components/atoms/SearchInput'
import PEMILU_IMAGE from '@/assets/pemilu-image.png'
import Image from 'next/image'
import { BiTimer } from 'react-icons/bi'
import { FiPlus } from 'react-icons/fi'
import formatCustomDate from '@/utils/formatCustomDate'
import Link from 'next/link'
import Layout from '@/components/templates/Layout'
import { Loader, Tooltip } from '@mantine/core'
import { getMyPemilu } from '@/lib/firebase/service'
import { PemiluDatas } from '@/interfaces/pemilu'
import { getToken } from 'next-auth/jwt'
import { NextApiRequest, NextPageContext } from 'next'
import { collection, getDocs } from 'firebase/firestore'
import { firestore } from '@/lib/firebase/init'
import useAllPemiluSnapshot from '@/hooks/useAllPemiluSnapshot'

export default function Home({ listPemilu }: { listPemilu: PemiluDatas[] }) {
  const [search, setSearch] = React.useState<string>('')
  const [isSearching, setIsSearching] = React.useState<boolean>(false)
  const [pemiluResults, setPemiluResults] = React.useState<PemiluDatas[] | null>(null)
  const pemiluDatasUptodate = useAllPemiluSnapshot(listPemilu)

  React.useEffect(() => {
    let timeout: any

    if (search.trim().length > 0) {
      setIsSearching(true)

      timeout = setTimeout(async () => {
        try {
          const results = await getPemiluBySearch(search)
          setPemiluResults(results as unknown as PemiluDatas[])
        } catch (error) {
          console.error(error)
        } finally {
          setIsSearching(false)
        }
      }, 500)
    } else {
      setIsSearching(false)
      setPemiluResults(null)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [search])

  async function getPemiluBySearch(key: string) {
    const snapshot = await getDocs(collection(firestore, 'pemilu'))
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))

    const filteredData = data.filter((item: any) => {
      const searchData = `${item.name} ${item.slug}`.toLowerCase()
      return searchData.includes(key.toLowerCase())
    })

    return filteredData
  }

  return (
    <Layout isLogoutBtn>
      <SearchInput
        placeholder="Cari.."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="flex flex-col gap-3 mt-5">
        {pemiluResults ? (
          isSearching ? (
            <div className="flex items-center justify-center mb-4 mt-1">
              <Loader style={{ fill: '#000' }} variant="dots" size="sm" />
            </div>
          ) : (
            pemiluResults?.map(pemilu => (
              <Link
                href={`/${pemilu.slug}`}
                key={pemilu.slug}
                className="rounded-[10px] border border-two p-4 flex items-center gap-4 shadow-md hover:shadow-sm transition-all duration-300 cursor-pointer">
                <Image
                  src={PEMILU_IMAGE}
                  alt="image pemilu"
                  className="w-[101px] h-[96px]"
                />
                <div className="flex flex-col justify-between gap-1">
                  <h1 className="text-one text-[14px] font-semibold">{pemilu.name}</h1>
                  <ul className="text-one text-[12px] font-medium leading-5">
                    <li>{pemilu?.options?.length || 0} Kandidat</li>
                    <li>
                      {pemilu.options.flatMap(val =>
                        val.voters ? val.voters.map(voter => voter.email) : []
                      )?.length || 0}{' '}
                      Pemilih
                    </li>
                  </ul>
                  <div className="flex items-center gap-1 text-three text-[12px]">
                    <BiTimer size={16} />
                    <p>
                      Berakhir{' '}
                      {formatCustomDate(new Date(pemilu.started_at) || new Date())}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )
        ) : (
          <>
            {pemiluDatasUptodate.length < 3 ? (
              <Tooltip label="Buat Pemilu" withArrow position="bottom">
                <Link
                  href="/create"
                  className="rounded-[10px] border border-dashed border-two p-[15px] flex items-center justify-center gap-4 hover:shadow-md transition-all duration-300 cursor-pointer text-three">
                  <FiPlus size={30} />
                </Link>
              </Tooltip>
            ) : (
              <p className="m-auto text-[12px] text-danger">
                `Buat pemilu sudah batas maksimal (3)`
              </p>
            )}
            {pemiluDatasUptodate?.map(pemilu => (
              <Link
                href={`/${pemilu.slug}`}
                key={pemilu.slug}
                className="rounded-[10px] border border-two p-4 flex items-center gap-4 shadow-md hover:shadow-sm transition-all duration-300 cursor-pointer">
                <Image
                  src={PEMILU_IMAGE}
                  alt="image pemilu"
                  className="w-[101px] h-[96px]"
                />
                <div className="flex flex-col justify-between gap-1">
                  <h1 className="text-one text-[14px] font-semibold">{pemilu.name}</h1>
                  <ul className="text-one text-[12px] font-medium leading-5">
                    <li>{pemilu?.options?.length || 0} Kandidat</li>
                    <li>
                      {pemilu.options.flatMap(val =>
                        val.voters ? val.voters.map(voter => voter.email) : []
                      )?.length || 0}{' '}
                      Pemilih
                    </li>
                  </ul>
                  <div className="flex items-center gap-1 text-three text-[12px]">
                    <BiTimer size={16} />
                    {pemilu.started_at < new Date().getTime() ? (
                      <p>
                        Berakhir{' '}
                        {formatCustomDate(new Date(pemilu.ended_at) || new Date())}
                      </p>
                    ) : (
                      <p>
                        Dimulai{' '}
                        {formatCustomDate(new Date(pemilu.started_at) || new Date())}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </>
        )}
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

  return {
    props: {
      listPemilu,
    },
  }
}
