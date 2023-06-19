import { Wallet, ethers } from "ethers"
import { Dispatch, SetStateAction } from "react"

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

export interface INotifyContext {
  setMessage: Dispatch<SetStateAction<IMessage | null>>
}

export interface INotifyContextProvider {
  children: React.ReactNode
}

export interface IModal {
  show: boolean
  onOk: (loginHash?: string) => Promise<string>
  onCancel: () => void
  onFinish: (wallet?: Wallet) => void
  setLoginSalt: Dispatch<SetStateAction<string | null>>
  loginSalt: string
}
