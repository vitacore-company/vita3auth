import { ethers } from "ethers"

export interface AuthI {
  onEOAchange: React.Dispatch<React.SetStateAction<walletEOAState>>
}

export type walletEOAState = ethers.Wallet | null
