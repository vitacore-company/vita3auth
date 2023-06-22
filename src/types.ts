import { ethers } from "ethers"
import {
  ChangeEvent,
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
} from "react"

export interface IAuthContextProvider extends IAuth {
  children: ReactNode
}
export interface IAuth {
  onEOAchange: React.Dispatch<React.SetStateAction<walletEOAState>>
  label: string
  language?: "en" | "ru" | "ch" | "ar" | "sp" | "in" | "it" | "ge"
  saveCodeExternal: ISaveExternalMethod[]
  addCodeExternal: IAddExternalMethod[]
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
  generateWallet: () => void
  loginSalt: string | null
  email: string
  setEmail: Dispatch<SetStateAction<string>>
  password: string
  setPassword: Dispatch<SetStateAction<string>>
  saveCodeMethods: Imethod[]
  addCodeMethods: Imethod[]
}

export interface IAuthContextProvider {
  children: React.ReactNode
}

export interface IModal {
  closeModal: () => void
}

export interface IModalBtn extends Imethod {}

export interface IUpload {
  uploadRef: RefObject<HTMLInputElement>
  onFinish?: () => void
}

export interface Imethod {
  label: string
  fn: () => void
  icon: () => JSX.Element
}
export interface ISaveExternalMethod {
  label: string
  fn: (salt: string) => void
  icon: () => JSX.Element
}
export interface IAddExternalMethod {
  label: string
  fn: () => string
  icon: () => JSX.Element
}
