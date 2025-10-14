import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import applicationReducer from './applicationSlice'

export const store = configureStore({
  reducer: {
     user: userReducer,
     application: applicationReducer,
  },
})
