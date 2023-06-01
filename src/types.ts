import { ethers } from "ethers"

export interface AuthI {
  onEOAchange: React.Dispatch<React.SetStateAction<walletEOAState>>
  label: string
}

export type walletEOAState = ethers.Wallet | null

export interface IEllipse {
  className: string
}
export interface IAddressEOA {
  address?: string
}
