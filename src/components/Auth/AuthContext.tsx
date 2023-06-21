import {
  useState,
  createContext,
  useContext,
  useEffect,
  ChangeEvent,
} from "react"
import { ethers } from "ethers"

import Notify from "../Notify/Notify"
import {
  AuthI,
  IMessage,
  IAuthContext,
  IAuthContextProvider,
} from "../../types"
import Modal from "../Modal/Modal"
import {
  checkLoginSalt,
  downloadAsFile,
  getCryptoHash,
  readFromBuffer,
  uploadFile,
  writeToBuffer,
} from "../../utils/utils"
import i18n from "../../utils/translation"
import { useTranslation } from "react-i18next"

export const AuthContext = createContext<IAuthContext>({
  setMessage: () => undefined,
  setModalShow: () => undefined,
  setLoginSalt: () => undefined,
  generateWallet: () => new Promise(() => ""),
  copyToBuffer: () => new Promise(() => {}),
  downloadSalt: () => undefined,
  writeLoginSalt: () => new Promise(() => null),
  getSaltFromFile: () => new Promise(() => null),
  loginSalt: null,
  email: "",
  setEmail: () => undefined,
  password: "",
  setPassword: () => undefined,
})

export const AuthContextProvider = (props: IAuthContextProvider) => {
  const { onEOAchange, children, language } = props
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

  const copyToBuffer = async () => {
    writeToBuffer(loginSalt!)
    setMessage({ text: "copied", type: "success" })
  }

  const downloadSalt = () => {
    downloadAsFile(loginSalt!)
    setMessage({ text: "downloaded", type: "success" })
  }

  const writeLoginSalt = async () => {
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

  const getSaltFromFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = await uploadFile(e.target.files && e.target.files[0])
    if (file) {
      setLoginSalt(file)
      return file
    } else {
      setMessage({ text: "failed upload", type: "error" })
      return null
    }
  }

  return (
    <AuthContext.Provider
      value={{
        setMessage,
        setModalShow,
        loginSalt,
        setLoginSalt,
        generateWallet,
        copyToBuffer,
        downloadSalt,
        writeLoginSalt,
        getSaltFromFile,
        email,
        setEmail,
        password,
        setPassword,
      }}
    >
      {modalShow && <Modal closeModal={closeModal} />}
      {message && <Notify message={message} />}
      {children}
    </AuthContext.Provider>
  )
}

export const withAuthContext = (Component: (props: AuthI) => JSX.Element) => {
  const EnhancedComponent = (props: AuthI) => {
    return (
      <AuthContextProvider {...props}>
        <Component {...props} />
      </AuthContextProvider>
    )
  }
  return EnhancedComponent
}

export const useAuthContext = () => useContext(AuthContext)
