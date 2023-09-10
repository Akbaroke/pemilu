import Head from 'next/head'
import Topbar from '../organisms/Topbar'
import NextNProgress from 'nextjs-progressbar'

type Props = {
  title?: string
  children: React.ReactNode
  isLogoutBtn?: boolean
  isBackBtn?: boolean
}

export default function Layout({ title, children, isLogoutBtn, isBackBtn }: Props) {
  return (
    <div className="w-full h-screen sm:w-[390px] sm:h-[844px] overflow-hidden overflow-y-auto rounded-[10px] m-auto mt-2 shadow-lg relative">
      <Head>
        <title>{title ? `Pilihanku | ${title}` : 'Pilihanku'}</title>
      </Head>
      <Topbar isLogoutBtn={isLogoutBtn} isBackBtn={isBackBtn} title={title} />
      <NextNProgress
        showOnShallow={false}
        options={{ showSpinner: false }}
        color="linear-gradient(197deg, #222121 40.02%, #CA3030 90.98%)"
      />
      <div className="p-[25px]">{children}</div>
    </div>
  )
}
