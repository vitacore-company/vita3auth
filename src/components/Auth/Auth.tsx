import { ethers } from "ethers"
import { useEffect, useState, useRef } from "react"
import { getCryptoHash } from "../../utils/utils"
import { AuthI } from "../../types"
import Ellipse from "../Ellipse/Ellipse"
import i18n from "i18next"
import { initReactI18next, useTranslation } from "react-i18next"
import translation from "../../utils/translations.json"
import { useNotify } from "../Notify/Notify"

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
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [authError, setAuthError] = useState<any>({ status: false })
  const [notify, setNotify] = useState<string>("")
  const [showNotify] = useNotify()

  const passwordInput = useRef<HTMLInputElement | null>(null)
  const formRef = useRef<any>(null)

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
    showNotify(message, t("notifyLabel"))
  }

  useEffect(() => {
    let notifyTimeout: any
    if (notify) {
      notifyTimeout = setTimeout(() => {
        setNotify("")
      }, 3000)
    }

    return () => {
      clearTimeout(notifyTimeout)
    }
  }, [notify])

  useEffect(() => {
    formRef.current.classList.remove("auth_form-error")
    let timeout: any
    if (authError.status) {
      formRef.current.classList.add("auth_form-error")
      timeout = setTimeout(() => {
        setAuthError({ status: false })
      }, 1000)
    }

    return () => {
      console.log("clear")
      clearTimeout(timeout)
    }
  }, [authError])

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
      const userPrivateKey = await getCryptoHash(`${email}_${password}`)
      const newUserWallet = new ethers.Wallet(userPrivateKey)
      onEOAchange(newUserWallet)
      setEmail("")

      setPassword("")
      return
    }
    activateAuthError(t("lackData"))
  }

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language)
    }
  }, [language])

  return (
    <div className="auth" id="auth">
      <div className="auth_label">{label}</div>
      <div ref={formRef} id="form" className="auth_form">
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
      </div>
      <div onClick={handleAuth} className="auth_submit">
        <div className="auth_submit_label">{t("login")}</div>
      </div>
      <Ellipse className="auth_ellipse1" />
      <Ellipse className="auth_ellipse2" />
      <div id="auth" />
    </div>
  )
}

export default Auth
