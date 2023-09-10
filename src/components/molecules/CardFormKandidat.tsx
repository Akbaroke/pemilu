import * as React from 'react'
import Input from '../atoms/Input'
import { isNotEmpty, useForm } from '@mantine/form'
import InputImage from '../atoms/InputImage'
import InputColor from '../atoms/InputColor'
import { Accordion, LoadingOverlay } from '@mantine/core'
import { IoIosArrowDown } from 'react-icons/io'
import { PiTrashBold } from 'react-icons/pi'
import { useDispatch, useSelector } from 'react-redux'
import { deleteKandidats, setOrUpdateKandidats } from '@/redux/slices/createPemiluSlice'
import { useHover } from '@mantine/hooks'
import { RootState } from '@/redux/store'
import { FileWithPath } from '@mantine/dropzone'

type PemiluFormType = {
  name: string
  image: string
  color: string
}

type Props = {
  number: number
  handleDeleteButton?: () => void
}

export default function CardFormKandidat({ number, handleDeleteButton }: Props) {
  const dispatch = useDispatch()
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [imageFile, setImageFile] = React.useState<FileWithPath>()
  const { hovered, ref } = useHover()
  const { kandidats } = useSelector((state: RootState) => state.CreatePemiluSlice)

  const form = useForm<PemiluFormType>({
    validateInputOnChange: true,
    validateInputOnBlur: true,
    initialValues: {
      name: kandidats[number - 1]?.name || '',
      image: kandidats[number - 1]?.image.url || '',
      color: kandidats[number - 1]?.color || '',
    },
    validate: {
      name: value => {
        if (!/^[a-zA-Z0-9 ]{3,30}$/.test(value)) {
          return 'Nama hanya diisi dengan huruf 3-30 karakter.'
        }
        return null
      },
      image: isNotEmpty('Foto tidak boleh kosong.'),
      color: isNotEmpty('Warna tidak boleh kosong.'),
    },
  })

  React.useEffect(() => {
    if (form.isValid()) {
      dispatch(
        setOrUpdateKandidats({
          ...form.values,
          isValid: true,
          id: number.toString(),
          image: {
            url: form.values.image,
            file: imageFile,
          },
        })
      )
    } else {
      dispatch(
        setOrUpdateKandidats({
          ...form.values,
          isValid: false,
          id: number.toString(),
          image: {
            url: form.values.image,
            file: imageFile,
          },
        })
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values])

  return (
    <div className="border rounded-[10px] leading-6 overflow-hidden">
      <Accordion unstyled chevron={false} defaultValue={number.toString()}>
        <Accordion.Item value={number.toString()}>
          <Accordion.Control
            className="px-4 py-3 bg-two w-full"
            onClick={() => setIsExpanded(!isExpanded)}>
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-[15px] text-one">Kandidat {number}</h1>
              <IoIosArrowDown
                className={`text-one transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </div>
          </Accordion.Control>
          <Accordion.Panel>
            <form className="px-4 pb-4 pt-3 relative">
              <LoadingOverlay
                visible={hovered}
                overlayBlur={2}
                loader={<></>}
                overlayColor="#a0a0a0"
              />
              <Input
                label="Nama"
                id="name"
                type="text"
                value={form.values.name}
                errorLabel={form.errors.name as string}
                onChange={e => form.setFieldValue('name', e as string)}
              />
              <InputImage
                label="Foto"
                id="image"
                value={form.values.image}
                errorLabel={form.errors.image as string}
                onChange={e => {
                  form.setFieldValue('image', URL.createObjectURL(e as FileWithPath))
                  setImageFile(e as FileWithPath)
                }}
              />
              <InputColor
                label="Warna"
                id="color"
                value={form.values.color}
                errorLabel={form.errors.color as string}
                onChange={e => form.setFieldValue('color', e as string)}
              />
              {handleDeleteButton ? (
                <div
                  ref={ref}
                  className="rounded-[10px] bg-white border border-danger/50 border-dashed p-[10px] flex items-center justify-center gap-4 hover:shadow-md transition-all duration-300 cursor-pointer text-danger relative hover:z-[500] hover:bg-danger hover:text-white mt-5"
                  onClick={() => {
                    handleDeleteButton()
                    dispatch(deleteKandidats(number.toString()))
                  }}>
                  <PiTrashBold size={20} />
                </div>
              ) : null}
            </form>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}
