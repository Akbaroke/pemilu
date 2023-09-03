import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface FormDetailState {
  name: string
  maxQueue: number
  started_at: Date
  ended_at: Date
  isValid: boolean
}
interface FormKandidatState {
  id: string
  name: string
  image: string
  color: string
  isValid: boolean
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

const CreatePemiluSlice = createSlice({
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
    unsetKandidats: state => {
      state.kandidats = []
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
    unsetBilikSuara: state => {
      state.bilikSuara = []
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
    unsetDetail: state => {
      state.detail = null
    },
  },
})

export const {
  setOrUpdateKandidats,
  deleteKandidats,
  unsetKandidats,
  setOrUpdateBilikSuara,
  deleteBilikSuara,
  unsetBilikSuara,
  setDetail,
  unsetDetail,
} = CreatePemiluSlice.actions
export default CreatePemiluSlice.reducer
