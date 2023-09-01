import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface FormKandidatState {
  id: string
  name: string
  image: string
  color: string
  isValid: boolean
}

export type initialTypeCreatePemilu = {
  kandidats: FormKandidatState[]
}

const initialState: initialTypeCreatePemilu = {
  kandidats: [],
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
  },
})

export const { setOrUpdateKandidats, deleteKandidats, unsetKandidats } =
  CreatePemiluSlice.actions
export default CreatePemiluSlice.reducer
