import { Wallet, ethers } from "ethers"
import { Dispatch, ReactNode, RefObject, SetStateAction } from "react"

export interface IAuthContextProvider extends IAuth {
  children: ReactNode
}
export interface IAuth {
  onEOAchange: (wallet: Wallet) => void
  label: string
  language?: "en" | "ru" | "ch" | "ar" | "sp" | "in" | "it" | "ge"
  saveCodeExternal: ISaveExternalMethod[]
  addCodeExternal: IAddExternalMethod[]
  test?: { loginSalt: string | null }
  providerURL?: string
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
  message: IMessage | null
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

export interface IStep2 {
  title: string
  methodList: IExternalMethod[]
  callback: (fn: () => void) => Promise<void>
}

export interface IUpload {
  uploadRef: RefObject<HTMLInputElement>
  onFinish?: () => void
}

export interface Imethod {
  label: string
  fn: () => void
  icon: () => JSX.Element
}
export interface IExternalMethod {
  label: string
  fn: () => void
  icon: () => JSX.Element
}
export interface IAddExternalMethod {
  label: string
  fn: () => string
  icon: () => JSX.Element
}
export interface ISaveExternalMethod {
  label: string
  fn: (e: string) => void
  icon: () => JSX.Element
}
