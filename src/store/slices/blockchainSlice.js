import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  address: null,
  connected: false,
  tokenBalance: '0',
  totalSupply: '0'
}

const blockchainSlice = createSlice({
  name: 'blockchain',
  initialState,
  reducers: {
    setWalletAddress: (state, action) => {
      state.address = action.payload
      state.connected = !!action.payload
    },
    setTokenInfo: (state, action) => {
      state.tokenBalance = action.payload.balance
      state.totalSupply = action.payload.totalSupply
    }
  }
})

export const { setWalletAddress, setTokenInfo } = blockchainSlice.actions
export default blockchainSlice.reducer
