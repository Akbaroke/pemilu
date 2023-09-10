import * as React from 'react'
import { useForm } from '@mantine/form'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import InputDateTime from '../atoms/InputDateTime'
import { setDetail } from '@/redux/slices/createPemiluSlice'
import Input from '../atoms/Input'

type DetailFormType = {
  name: string
  maxVoters: number
  prepareTime: number
  limitTime: number
  started_at: Date
  ended_at: Date
}

export default function DetailForm({ DetailValues }: { DetailValues?: DetailFormType }) {
  const dispatch = useDispatch()
  const { detail } = useSelector((state: RootState) => state.CreatePemiluSlice)

  const form = useForm<DetailFormType>({
    validateInputOnChange: true,
    validateInputOnBlur: true,
    initialValues: {
      name: DetailValues?.name || detail?.name || '',
      maxVoters: DetailValues?.maxVoters || detail?.maxVoters || 0,
      prepareTime: DetailValues?.prepareTime || detail?.prepareTime || 0,
      limitTime: DetailValues?.limitTime || detail?.limitTime || 0,
      started_at: new Date(DetailValues?.started_at || detail?.started_at || 0),
      ended_at: new Date(DetailValues?.ended_at || detail?.ended_at || 0),
    },
    validate: {
      name: value => {
        if (!/^[a-zA-Z0-9 ]{3,30}$/.test(value)) {
          return 'Nama Pemilu hanya diisi dengan huruf 3-30 karakter.'
        }
        return null
      },
      maxVoters: value => {
        if (value < 5) {
          return 'Maximal Pemilih tidak boleh kurang dari 5 orang.'
        }
        return null
      },
      prepareTime: value => {
        if (value < 3) {
          return 'Waktu persiapan tidak boleh kurang dari 3 detik.'
        } else if (value > 30) {
          return 'Waktu persiapan tidak boleh lebih dari 30 detik.'
        }
        return null
      },
      limitTime: value => {
        if (value < 10) {
          return 'Waktu persiapan tidak boleh kurang dari 10 detik.'
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
      dispatch(
        setDetail({
          isValid: true,
          ...form.values,
          started_at: new Date(form.values.started_at).getTime(),
          ended_at: new Date(form.values.ended_at).getTime(),
        })
      )
    } else {
      dispatch(
        setDetail({
          isValid: false,
          ...form.values,
          started_at: new Date(form.values.started_at).getTime(),
          ended_at: new Date(form.values.ended_at).getTime(),
        })
      )
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values])

  React.useEffect(() => {
    if (detail) {
      form.setValues({
        ...detail,
        started_at: new Date(detail.started_at),
        ended_at: new Date(detail.ended_at),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="pb-2 border-b ">
        <h1 className="text-one font-bold text-[20px]">Detail Pemilu</h1>
      </div>
      <div className="flex flex-col">
        <Input
          label="Nama/Jenis Pemilu"
          id="name"
          type="text"
          value={form.values.name}
          errorLabel={form.errors.name as string}
          onChange={e => form.setFieldValue('name', e as string)}
        />
        <Input
          label="Maximal Pemilih"
          id="maxVoters"
          type="number"
          min={0}
          value={form.values.maxVoters}
          errorLabel={form.errors.maxVoters as string}
          onChange={e => form.setFieldValue('maxVoters', e as unknown as number)}
        />
        <Input
          label="Waktu Persiapan (detik)"
          id="prepareTime"
          type="number"
          min={0}
          value={form.values.prepareTime}
          errorLabel={form.errors.prepareTime as string}
          onChange={e => form.setFieldValue('prepareTime', e as unknown as number)}
        />
        <Input
          label="Batas Waktu (detik)"
          id="limitTime"
          type="number"
          min={0}
          value={form.values.limitTime}
          errorLabel={form.errors.limitTime as string}
          onChange={e => form.setFieldValue('limitTime', e as unknown as number)}
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
