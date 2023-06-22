import { useState, createContext, useContext, useEffect, useMemo } from "react"
import { ethers } from "ethers"

import Notify from "../Notify/Notify"
import {
  IAuth,
  IMessage,
  IAuthContext,
  IAuthContextProvider,
  Imethod,
} from "../../types"
import Modal from "../Modal/Modal"
import {
  checkLoginSalt,
  downloadCodeAsFile,
  getCryptoHash,
  readFile,
  readFromBuffer,
  uploadFile,
  writeCodeToBuffer,
} from "../../utils/utils"
import i18n from "../../utils/translation"
import { useTranslation } from "react-i18next"

export const AuthContext = createContext<IAuthContext>({
  setMessage: () => undefined,
  setModalShow: () => undefined,
  setLoginSalt: () => undefined,
  generateWallet: () => new Promise(() => ""),
  loginSalt: null,
  email: "",
  setEmail: () => undefined,
  password: "",
  setPassword: () => undefined,
  saveCodeMethods: [],
  addCodeMethods: [],
})

export const AuthContextProvider = (props: IAuthContextProvider) => {
  const { onEOAchange, children, language, saveCodeExternal, addCodeExternal } =
    props
  const { t } = useTranslation()

  const [message, setMessage] = useState<IMessage | null>(null)
  const [modalShow, setModalShow] = useState(false)

  const [loginSalt, setLoginSalt] = useState<string | null>(
    localStorage.getItem("loginSalt") || null
  )
  const [email, setEmail] = useState<string>(
    localStorage.getItem("email") || ""
  )
  const [password, setPassword] = useState<string>(
    localStorage.getItem("password") || ""
  )

  const saveCodeMethods: Imethod[] = useMemo(
    () => [
      {
        label: "Скопировать в буффер",
        fn: () => writeCodeToBuffer(loginSalt!),
        icon: () => <div>B</div>,
      },
      {
        label: "Загрузить файл",
        fn: () => downloadCodeAsFile(loginSalt!),
        icon: () => <div>F</div>,
      },
      ...saveCodeExternal.map(({ label, fn, icon }) => ({
        label,
        icon,
        fn: () => fn(loginSalt!),
      })),
    ],
    [loginSalt, saveCodeExternal]
  )

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language)
    }
  }, [language])

  useEffect(() => {
    if (loginSalt) {
      setMessage({
        text: `${t("hashAdded")}: ${loginSalt.slice(0, 3)}...`,
        type: "success",
      })
    }
  }, [loginSalt, setMessage, t])

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (message) {
      timeout = setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
    return () => {
      clearTimeout(timeout)
    }
  }, [message])

  const closeModal = () => {
    setModalShow(false)
  }

  const generateWallet = async () => {
    if (email && password && loginSalt) {
      const userPrivateKey = await getCryptoHash(
        `${email}_${password}_${loginSalt}`
      )
      const newUserWallet = new ethers.Wallet(userPrivateKey)
      localStorage.setItem("loginSalt", loginSalt)
      localStorage.setItem("email", email)
      localStorage.setItem("password", password)
      onEOAchange(newUserWallet)
    } else {
      setMessage({ text: "generating wallet error", type: "error" })
    }
  }

  const writeSaltFromBuffer = async () => {
    const clipboardText = await readFromBuffer()
    const checkedSalt = checkLoginSalt(clipboardText)
    if (checkedSalt) {
      setLoginSalt(checkedSalt)
      return checkedSalt
    } else {
      setMessage({ text: t("wrongHash"), type: "error" })
      return null
    }
  }

  const getSaltFromFile = async () => {
    const file = await uploadFile()
    if (file) {
      const salt = await readFile(file)
      if (salt) {
        setLoginSalt(salt)
        return salt
      }
    }
    setMessage({ text: "failed upload", type: "error" })
    return null
  }

  const addCodeMethods: Imethod[] = [
    {
      label: "Добавить из файла",
      fn: getSaltFromFile,
      icon: () => <div>&darr;</div>,
    },
    {
      label: "Добавить код из буффера",
      fn: writeSaltFromBuffer,
      icon: () => <div>B</div>,
    },
    ...addCodeExternal.map(({ label, fn, icon }) => ({
      label,
      icon,
      fn: async () => {
        const salt = await fn()
        setLoginSalt(salt)
      },
    })),
  ]

  return (
    <AuthContext.Provider
      value={{
        setMessage,
        setModalShow,
        loginSalt,
        setLoginSalt,
        generateWallet,
        email,
        setEmail,
        password,
        setPassword,
        saveCodeMethods,
        addCodeMethods,
      }}
    >
      {modalShow && <Modal closeModal={closeModal} />}
      {message && <Notify message={message} />}
      {children}
    </AuthContext.Provider>
  )
}

export const withAuthContext = (Component: (props: IAuth) => JSX.Element) => {
  const EnhancedComponent = (props: IAuth) => {
    return (
      <AuthContextProvider {...props}>
        <Component {...props} />
      </AuthContextProvider>
    )
  }
  return EnhancedComponent
}

export const useAuthContext = () => useContext(AuthContext)
