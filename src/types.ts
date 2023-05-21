import { ethers } from "ethers"

export interface AuthI {
  onEOAchange: React.Dispatch<React.SetStateAction<ethers.Wallet | null>>
}

export type walletEOAState = ethers.Wallet | null
