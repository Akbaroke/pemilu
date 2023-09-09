import { useRouter } from 'next/router';
import { AiOutlineLogout } from 'react-icons/ai';
import { IoIosArrowBack } from 'react-icons/io';
import { Tooltip } from '@mantine/core';
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import LOGO from '@/assets/logo.png'

type Props = {
  title?: string
  isLogoutBtn?: boolean
  isBackBtn?: boolean
}

export default function Topbar({ title, isLogoutBtn, isBackBtn }: Props) {
  const router = useRouter()

  return (
    <div className="bg-white shadow-sm h-[60px] px-[25px] flex justify-between items-center sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {isBackBtn ? (
          <Tooltip label="Back" withArrow position="bottom">
            <div onClick={() => router.back()} className="cursor-pointer">
              <IoIosArrowBack size={18} />
            </div>
          </Tooltip>
        ) : null}
        {title ? (
          <h1 className="font-semibold text-[16px] text-one">{title}</h1>
        ) : (
          <Image
            src={LOGO}
            alt="logo pilihanku"
            width={135}
            onClick={() => window.location.replace('/')}
            className="cursor-pointer"
          />
        )}
      </div>
      {isLogoutBtn ? (
        <Tooltip label="Logout" withArrow position="bottom">
          <div
            className="bg-two w-[35px] h-[35px] rounded-[5px] grid place-items-center cursor-pointer shadow-md transition-all hover:shadow-sm"
            onClick={() => signOut()}>
            <AiOutlineLogout size={17} />
          </div>
        </Tooltip>
      ) : null}
    </div>
  )
}
