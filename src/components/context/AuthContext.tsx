import {
  useState,
  createContext,
  useContext,
  useEffect,
  ChangeEvent,
} from "react"
import { ethers } from "ethers"
import { v4 as uuidv4 } from "uuid"

import Notify from "../Notify/Notify"
import {
  AuthI,
  IMessage,
  IAuthContext,
  IAuthContextProvider,
} from "../../types"
import Modal from "../Modal/Modal"
import { Wallet } from "ethers"
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
  generateWallet: () => undefined,
  copyToBuffer: () => undefined,
  downloadSalt: () => undefined,
  writeLoginSalt: () => undefined,
  getSaltFromFile: () => undefined,
  loginSalt: null,
})

export const AuthContextProvider = (props: IAuthContextProvider) => {
  const { onEOAchange, children, language } = props
  const { t } = useTranslation()

  const [message, setMessage] = useState<IMessage | null>(null)
  const [modalShow, setModalShow] = useState(false)
  const [eoaWallet, setEOAWallet] = useState<Wallet>()

  const [loginSalt, setLoginSalt] = useState<string | null>(
    localStorage.getItem("loginSalt") || null
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

  const sendEOA = (wallet?: Wallet) => {
    if (wallet) {
      onEOAchange(wallet)
    } else {
      onEOAchange(eoaWallet!)
    }
  }

  const generateWallet = async (
    email: string,
    password: string,
    loginSalt?: string
  ) => {
    let currentLoginSalt
    if (loginSalt) {
      currentLoginSalt = loginSalt
    } else {
      currentLoginSalt = uuidv4()
    }
    localStorage.setItem("loginSalt", currentLoginSalt)
    const userPrivateKey = await getCryptoHash(
      `${email}_${password}_${currentLoginSalt}`
    )
    const newUserWallet = new ethers.Wallet(userPrivateKey)
    setEOAWallet(newUserWallet)
    if (loginSalt) sendEOA(newUserWallet)
    localStorage.setItem("email", email)
    localStorage.setItem("password", password)
    return currentLoginSalt
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
    } else {
      setMessage({ text: t("wrongHash"), type: "error" })
    }
  }

  const getSaltFromFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file: any = await uploadFile(e.target.files && e.target.files[0])
    if (file) {
      setLoginSalt(file)
    } else {
      setMessage({ text: "failed upload", type: "error" })
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
      }}
    >
      {modalShow && (
        <Modal
          onOk={generateWallet}
          closeModal={closeModal}
          onFinish={sendEOA}
          setLoginSalt={setLoginSalt}
          loginSalt={loginSalt || ""}
        />
      )}
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
