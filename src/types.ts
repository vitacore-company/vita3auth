import { ethers } from "ethers"

export interface AuthI {
  onEOAchange: React.Dispatch<React.SetStateAction<walletEOAState>>
  label: string
  language?: "en" | "ru" | "ch" | "ar" | "sp" | "in" | "it" | "ge"
}

export type walletEOAState = ethers.Wallet | null

export interface IEllipse {
  className: string
}
export interface IAddressEOA {
  address?: string
  noAddressLabel?: string
}

export interface INotify {
  message: string
  label: string
}
