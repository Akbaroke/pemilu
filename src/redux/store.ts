import { configureStore, Store } from '@reduxjs/toolkit'
import createPemiluSlice, { initialTypeCreatePemilu } from './slices/createPemiluSlice'

export interface RootState {
  CreatePemiluSlice: initialTypeCreatePemilu
}

const store: Store<RootState> = configureStore({
  reducer: {
    CreatePemiluSlice: createPemiluSlice,
  },
})

store.subscribe(() => {
  console.log('store change:', store.getState())
})

export default store
