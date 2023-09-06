import { FileWithPath } from '@mantine/dropzone'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface FormDetailState {
  name: string
  maxQueue: number
  started_at: number
  ended_at: number
  isValid: boolean
}
interface FormKandidatState {
  id: string
  name: string
  image: Image
  color: string
  isValid: boolean
}

type Image = {
  url: string
  file: FileWithPath
}

interface FormBilikSuaraState {
  id: string
  prepare: number
  timer: number
  isValid: boolean
}

export type initialTypeCreatePemilu = {
  detail: FormDetailState | null
  kandidats: FormKandidatState[]
  bilikSuara: FormBilikSuaraState[]
}

const initialState: initialTypeCreatePemilu = {
  detail: null,
  kandidats: [],
  bilikSuara: [],
}

const CreatePemiluSlice: any = createSlice({
  name: 'formKandidat',
  initialState,
  reducers: {
    setOrUpdateKandidats: (state, action: PayloadAction<FormKandidatState>) => {
      const index = state.kandidats.findIndex(data => data.id === action.payload.id)
      if (index !== -1) {
        state.kandidats[index] = action.payload
      } else {
        state.kandidats.push(action.payload)
      }
    },
    deleteKandidats: (state, action: PayloadAction<string>) => {
      state.kandidats = state.kandidats.filter(data => data.id !== action.payload)
    },

    setOrUpdateBilikSuara: (state, action: PayloadAction<FormBilikSuaraState>) => {
      const index = state.bilikSuara.findIndex(data => data.id === action.payload.id)
      if (index !== -1) {
        state.bilikSuara[index] = action.payload
      } else {
        state.bilikSuara.push(action.payload)
      }
    },
    deleteBilikSuara: (state, action: PayloadAction<string>) => {
      state.bilikSuara = state.bilikSuara.filter(data => data.id !== action.payload)
    },

    setDetail: (state, action: PayloadAction<FormDetailState>) => {
      state.detail = {
        name: action.payload.name,
        maxQueue: action.payload.maxQueue,
        started_at: action.payload.started_at,
        ended_at: action.payload.ended_at,
        isValid: action.payload.isValid,
      }
    },

    resetFormState: state => {
      state.detail = null
      state.kandidats = []
      state.bilikSuara = []
    },
  },
})

export const {
  setOrUpdateKandidats,
  deleteKandidats,
  setOrUpdateBilikSuara,
  deleteBilikSuara,
  setDetail,
  resetFormState,
} = CreatePemiluSlice.actions
export default CreatePemiluSlice.reducer
