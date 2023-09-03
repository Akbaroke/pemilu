import * as React from 'react'
import { isNotEmpty, useForm } from '@mantine/form'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import InputDateTime from '../atoms/InputDateTime'
import { setDetail } from '@/redux/slices/createPemiluSlice'
import Input from '../atoms/Input'

type DetailFormType = {
  name: string
  maxQueue: number
  started_at: Date
  ended_at: Date
}

export default function DetailForm() {
  const dispatch = useDispatch()
  const { detail } = useSelector((state: RootState) => state.CreatePemiluSlice)

  const form = useForm<DetailFormType>({
    validateInputOnChange: true,
    initialValues: {
      name: detail?.name || '',
      maxQueue: detail?.maxQueue || 0,
      started_at: detail?.started_at || new Date(),
      ended_at: detail?.ended_at || new Date(),
    },
    validate: {
      name: value => {
        if (!/^[a-zA-Z0-9 ]{3,30}$/.test(value)) {
          return 'Nama Pemilu hanya diisi dengan huruf 3-30 karakter.'
        }
        return null
      },
      maxQueue: value => {
        if (value < 1) {
          return 'Antrian tidak boleh kurang dari 1.'
        }
        return null
      },
      started_at: value => {
        if (value < new Date()) {
          return 'Dimulai harus lebih dari waktu sekarang.'
        }
        return null
      },
      ended_at: value => {
        if (value < new Date()) {
          return 'Berakhir harus lebih dari waktu sekarang.'
        } else if (value < form.values.started_at) {
          return 'Berakhir harus lebih dari dimulai.'
        }
        return null
      },
    },
  })

  React.useEffect(() => {
    if (form.isValid()) {
      dispatch(setDetail({ isValid: true, ...form.values }))
    } else {
      dispatch(setDetail({ isValid: false, ...form.values }))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values])

  return (
    <div className="flex flex-col gap-4">
      <div className="pb-2 border-b ">
        <h1 className="text-one font-bold text-[20px]">Detail Pemilu</h1>
      </div>
      <div>
        <Input
          label="Nama/Jenis Pemilu"
          id="name"
          type="text"
          value={form.values.name}
          errorLabel={form.errors.name as string}
          onChange={e => form.setFieldValue('name', e as string)}
        />
        <Input
          label="Maximal Jumlah Antrian"
          id="maxQueue"
          type="number"
          min={0}
          value={form.values.maxQueue}
          errorLabel={form.errors.maxQueue as string}
          onChange={e => form.setFieldValue('maxQueue', e as unknown as number)}
        />
        <InputDateTime
          label="Dimulai"
          id="started_at"
          minDate={new Date()}
          value={form.values.started_at as Date}
          errorLabel={form.errors.started_at as string}
          onChange={e => form.setFieldValue('started_at', e as Date)}
        />
        <InputDateTime
          label="Berakhir"
          id="ended_at"
          minDate={new Date()}
          value={form.values.ended_at as Date}
          errorLabel={form.errors.ended_at as string}
          onChange={e => form.setFieldValue('ended_at', e as Date)}
        />
      </div>
    </div>
  )
}
