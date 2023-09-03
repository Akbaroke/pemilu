import * as React from 'react'
import Input from '../atoms/Input'
import { isNotEmpty, useForm } from '@mantine/form'
import { Accordion, LoadingOverlay } from '@mantine/core'
import { IoIosArrowDown } from 'react-icons/io'
import { PiTrashBold } from 'react-icons/pi'
import { useDispatch, useSelector } from 'react-redux'
import { deleteBilikSuara, setOrUpdateBilikSuara } from '@/redux/slices/createPemiluSlice'
import { useHover } from '@mantine/hooks'
import { RootState } from '@/redux/store'

type PemiluFormType = {
  prepare: number
  timer: number
}

type Props = {
  number: number
  handleDeleteButton?: () => void
}

export default function CardFormBilikSuara({ number, handleDeleteButton }: Props) {
  const dispatch = useDispatch()
  const [isExpanded, setIsExpanded] = React.useState(false)
  const { hovered, ref } = useHover()
  const { bilikSuara } = useSelector((state: RootState) => state.CreatePemiluSlice)

  const form = useForm<PemiluFormType>({
    validateInputOnChange: true,
    initialValues: {
      prepare: bilikSuara[number - 1]?.prepare || 0,
      timer: bilikSuara[number - 1]?.timer || 0,
    },
    validate: {
      prepare: isNotEmpty('Prepare tidak boleh kosong.'),
      timer: value => {
        if (value < 10) {
          return 'Batas waktu tidak boleh kurang dari 10 detik.'
        }
        return null
      },
    },
  })

  React.useEffect(() => {
    if (form.isValid()) {
      dispatch(
        setOrUpdateBilikSuara({ isValid: true, ...form.values, id: number.toString() })
      )
    } else {
      dispatch(
        setOrUpdateBilikSuara({ isValid: false, ...form.values, id: number.toString() })
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
              <h1 className="font-semibold text-[15px] text-one">Bilik {number}</h1>
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
                label="Prepare"
                id="prepare"
                type="number"
                min={0}
                value={form.values.prepare}
                errorLabel={form.errors.prepare as string}
                onChange={e => form.setFieldValue('prepare', e as unknown as number)}
              />
              <Input
                label="Batas Waktu"
                id="timer"
                type="number"
                min={0}
                value={form.values.timer}
                errorLabel={form.errors.timer as string}
                onChange={e => form.setFieldValue('timer', e as unknown as number)}
              />
              {handleDeleteButton ? (
                <div
                  ref={ref}
                  className="rounded-[10px] bg-white border border-danger/50 border-dashed p-[10px] flex items-center justify-center gap-4 hover:shadow-md transition-all duration-300 cursor-pointer text-danger relative hover:z-[500] hover:bg-danger hover:text-white mt-5"
                  onClick={() => {
                    handleDeleteButton()
                    dispatch(deleteBilikSuara(number.toString()))
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
