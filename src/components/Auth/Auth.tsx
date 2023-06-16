import { ethers } from "ethers"
import { useEffect, useState, useRef } from "react"
import { useNotifyContext, withNotifyContext } from "../Notify/NotifyContext"
import { initReactI18next, useTranslation } from "react-i18next"
import { downloadAsFile, getCryptoHash } from "../../utils/utils"
import { AuthI, IauthError } from "../../types"
import { v4 as uuidv4 } from "uuid"
import Ellipse from "../Ellipse/Ellipse"
import translation from "../../utils/translations.json"
import i18n from "i18next"

i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: translation["ru"] },
    en: { translation: translation["en"] },
    ch: { translation: translation["ch"] },
    ar: { translation: translation["ar"] },
    sp: { translation: translation["sp"] },
    in: { translation: translation["in"] },
    it: { translation: translation["it"] },
    ge: { translation: translation["ge"] },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
})

function Auth(props: AuthI) {
  const { onEOAchange, label, language } = props
  const { t } = useTranslation()
  const { setMessage } = useNotifyContext()
  const [email, setEmail] = useState<string>(
    localStorage.getItem("email") || ""
  )
  const [password, setPassword] = useState<string>(
    localStorage.getItem("password") || ""
  )
  const [authError, setAuthError] = useState<IauthError>({ status: false })
  const [loginHash, setLoginHash] = useState<string | null>(
    localStorage.getItem("loginHash")
  )

  const passwordInput = useRef<HTMLInputElement | null>(null)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleEnterEmailDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (checkEmail()) {
        passwordInput.current?.focus()
        return
      }
      activateAuthError(t("wrongEmail"))
    }
  }

  const handleEnterPasswordDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleAuth()
    }
  }

  const activateAuthError = (message: string) => {
    setAuthError({ status: true })
    setMessage({ text: message })
  }

  const checkEmail = () => {
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/
    if (emailRegex.test(email)) {
      return true
    }
    return false
  }

  const handleAuth = async () => {
    if (!checkEmail()) {
      activateAuthError(t("wrongEmail"))
      return
    }
    if (email && password) {
      let currentLoginHash
      if (loginHash) {
        currentLoginHash = loginHash
      } else {
        currentLoginHash = uuidv4()
        downloadAsFile(currentLoginHash)
      }
      localStorage.setItem("loginHash", currentLoginHash)
      const userPrivateKey = await getCryptoHash(
        `${email}_${password}_${currentLoginHash}`
      )
      const newUserWallet = new ethers.Wallet(userPrivateKey)
      onEOAchange(newUserWallet)
      localStorage.setItem("email", email)
      localStorage.setItem("password", password)
      setEmail("")
      setPassword("")
      return
    }
    activateAuthError(t("lackData"))
  }

  const writeLoginHash = async () => {
    const clipboardText = await navigator.clipboard.readText()
    const hashRegex =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
    if (hashRegex.test(clipboardText)) {
      setLoginHash(clipboardText)
    } else {
      setMessage({ text: t("wrongHash") })
    }
  }

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language)
    }
  }, [language])

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (authError.status) {
      timeout = setTimeout(() => {
        setAuthError({ status: false })
      }, 1000)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [authError])

  return (
    <div className="auth" id="auth">
      <div className="auth_label">{label}</div>
      <div
        id="form"
        className={`auth_form ${authError.status && "auth_form-error"}`}
      >
        <div className="auth_form_email">
          <div className="auth_form_email_label">{t("email")}</div>
          <input
            type="email"
            autoFocus
            onKeyDown={handleEnterEmailDown}
            value={email}
            className="auth_form_email_input"
            onChange={handleEmailChange}
          />
        </div>
        <div className="auth_form_password">
          <div className="auth_form_password_label">{t("password")}</div>
          <input
            ref={passwordInput}
            onKeyDown={handleEnterPasswordDown}
            value={password}
            type="text"
            className="auth_form_password_input"
            onChange={handlePasswordChange}
          />
        </div>
        <div
          title="hi"
          onClick={writeLoginHash}
          className={`auth_form_hash ${
            loginHash ? "auth_form_hash-filled" : "auth_form_hash-empty"
          }`}
        >
          H
        </div>
      </div>
      <div onClick={handleAuth} className="auth_submit">
        <div className="auth_submit_label">{t("login")}</div>
      </div>
      <Ellipse className="auth_ellipse1" />
      <Ellipse className="auth_ellipse2" />
    </div>
  )
}

export default withNotifyContext(Auth)
