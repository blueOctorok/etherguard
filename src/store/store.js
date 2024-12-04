import { configureStore } from '@reduxjs/toolkit'
import blockchainReducer from './slices/blockchainSlice'

export const store = configureStore({
  reducer: {
    blockchain: blockchainReducer
  }
})
