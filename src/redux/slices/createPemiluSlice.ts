import { FormBilikSuaraState, FormDetailState, FormKandidatState } from '@/types/pemilu'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface initialTypeCreatePemilu {
  detail: FormDetailState | null
  kandidats: FormKandidatState[]
}

const initialState: initialTypeCreatePemilu = {
  detail: null,
  kandidats: [],
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

    setDetail: (state, action: PayloadAction<FormDetailState>) => {
      state.detail = {
        name: action.payload.name,
        maxVoters: action.payload.maxVoters,
        started_at: action.payload.started_at,
        ended_at: action.payload.ended_at,
        isValid: action.payload.isValid,
      }
    },

    resetFormState: state => {
      state.detail = null
      state.kandidats = []
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
