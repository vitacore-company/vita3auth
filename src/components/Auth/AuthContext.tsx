import {
  useState,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from "react"
import {
  IAuth,
  IAuthContext,
  IAuthContextProvider,
  IMessage,
  Imethod,
} from "../../types"
import {
  checkLoginSalt,
  downloadCodeAsFile,
  getCryptoHash,
  readFile,
  readFromBuffer,
  uploadFile,
  writeCodeToBuffer,
} from "../../utils/utils"
import { ethers } from "ethers"
import { useTranslation } from "react-i18next"
import { AuthContextDefault } from "./AuthContextDefault"
import i18n from "../../utils/translation"
import Notify from "../Notify/Notify"
import Modal from "../Modal/Modal"

export const AuthContext = createContext<IAuthContext>(AuthContextDefault)

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
      setMessage({ text: t("generatingWalletError"), type: "error" })
    }
  }

  const getSaltFromBuffer = useCallback(async () => {
    const clipboardText = await readFromBuffer()
    const checkedSalt = checkLoginSalt(clipboardText)
    if (checkedSalt) {
      setLoginSalt(checkedSalt)
      return checkedSalt
    } else {
      setMessage({ text: t("wrongHash"), type: "error" })
      return null
    }
  }, [t])

  const getSaltFromFile = useCallback(async () => {
    const file = await uploadFile()
    if (file) {
      const salt = await readFile(file)
      if (salt) {
        setLoginSalt(salt)
        return salt
      }
    }
    setMessage({ text: t("failedUpload"), type: "error" })
    return null
  }, [t])

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

  const addCodeMethods: Imethod[] = useMemo(
    () => [
      {
        label: t("addCodeFromFile"),
        fn: getSaltFromFile,
        icon: () => <div>&darr;</div>,
      },
      {
        label: t("addCodeFromBuffer"),
        fn: getSaltFromBuffer,
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
    ],
    [addCodeExternal, getSaltFromBuffer, getSaltFromFile, t]
  )

  const saveCodeMethods: Imethod[] = useMemo(
    () => [
      {
        label: t("addCodeToBuffer"),
        fn: () => writeCodeToBuffer(loginSalt!),
        icon: () => <div>B</div>,
      },
      {
        label: t("addCodeToFile"),
        fn: () => downloadCodeAsFile(loginSalt!),
        icon: () => <div>F</div>,
      },
      ...saveCodeExternal.map(({ label, fn, icon }) => ({
        label,
        icon,
        fn: () => fn(loginSalt!),
      })),
    ],
    [loginSalt, saveCodeExternal, t]
  )

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
      <Notify message={message} />
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
