import { useDisclosure } from '@mantine/hooks'
import { Modal } from '@mantine/core'
import Button from '../atoms/Button'
import Image from 'next/image'

interface Props {
  title: string
  message?: string
  actionTrue: () => void
  titleButtonAction?: string
  isLoading?: boolean
  children: React.ReactNode
  imgIcon: any
  className?: string
}

export default function ButtonWithModal({
  title,
  message,
  actionTrue,
  titleButtonAction,
  isLoading,
  children,
  imgIcon,
  className,
}: Props) {
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <Modal
        centered
        opened={opened}
        onClose={close}
        radius="lg"
        overlayProps={{
          opacity: 0.3,
          blur: 3,
        }}>
        <div className="bg-white px-7 py-4 flex flex-col gap-12">
          <div className="flex flex-col justify-center items-center gap-7">
            <Image
              src={imgIcon}
              alt="delete image"
              className="w-[100px]"
              width={100}
              height={100}
            />
            <div className="flex flex-col text-center text-one gap-2">
              <h1 className="text-[16px] font-bold">{title}</h1>
              <p className="text-[14px] font-medium">{message}</p>
            </div>
          </div>
          <div className="flex gap-5 m-auto mb-6">
            <Button onClick={close} className="bg-danger">
              Batal
            </Button>
            <Button
              onClick={() => {
                close()
                void actionTrue()
              }}>
              Ya, {titleButtonAction || children}
            </Button>
          </div>
        </div>
      </Modal>

      <Button onClick={open} isLoading={isLoading} className={className}>
        {children}
      </Button>
    </>
  )
}
