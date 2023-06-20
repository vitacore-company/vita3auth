import { Wallet, ethers } from "ethers"
import { Dispatch, ReactNode, SetStateAction } from "react"

export interface IAuthContextProvider extends AuthI {
  children: ReactNode
}
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

export interface IauthError {
  status: true | false
}

export interface IMessage {
  text: string
  type: "error" | "success"
}

export interface INotify {
  message: IMessage
}

export interface IAuthContext {
  setMessage: Dispatch<SetStateAction<IMessage | null>>
  setModalShow: Dispatch<SetStateAction<boolean>>
  setLoginSalt: Dispatch<SetStateAction<string | null>>
  generateWallet: any
  copyToBuffer: any
  downloadSalt: any
  writeLoginSalt: any
  getSaltFromFile: any
  loginSalt: string | null
}

export interface IAuthContextProvider {
  children: React.ReactNode
}

export interface IModal {
  onOk: any
  closeModal: () => void
  sendEOA: (wallet?: Wallet) => void
}
