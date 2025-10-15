import { configureStore } from '@reduxjs/toolkit'
import userSlice from './userSlice'
import applicationSlice from './applicationSlice'
import offerSlice from './offerSlice'

export const store = configureStore({
  reducer: {
     user: userSlice,
     application: applicationSlice,
     offer: offerSlice,
  },
})
