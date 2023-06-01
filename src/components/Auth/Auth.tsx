import { ethers } from "ethers"
import { useEffect, useState, useRef } from "react"
import { getCryptoHash } from "../../utils/utils"
import { AuthI, walletEOAState } from "../../types"
import Ellipse from "../Ellipse/Ellipse"
import i18n from "i18next"
import { initReactI18next, useTranslation } from "react-i18next"
import translation from "../../utils/translations.json"

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
  const [walletEOA, setWalletEOA] = useState<walletEOAState>(null)
  const [authError, setAuthError] = useState<boolean>(false)
  const passwordInput = useRef<HTMLInputElement | null>(null)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleEnterEmailDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      passwordInput.current?.focus()
    }
  }
  const handleEnterPasswordDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleAuth()
    }
  }

  const activateAuthError = () => {
    setAuthError(true)
    setTimeout(() => {
      setAuthError(false)
    }, 1000)
  }

  const handleAuth = async () => {
    if (email && password) {
      console.log("auth")
      const userPrivateKey = await getCryptoHash(`${email}_${password}`)
      console.log(`User private key: ${userPrivateKey}`)
      const newUserWallet = new ethers.Wallet(userPrivateKey)
      console.log("newUserWallet", newUserWallet)
      setWalletEOA(newUserWallet)
      onEOAchange(newUserWallet)
      setEmail("")
      setPassword("")
    } else {
      activateAuthError()
    }
  }

  useEffect(() => console.log("walletEOA", walletEOA), [walletEOA])

  useEffect(() => {
    console.log("email", email)
  }, [email])

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language)
    }
  }, [language])

  return (
    <div className="auth">
      <div className="auth_label">{label}</div>
      <div className={`auth_form ${authError && "auth_form-error"}`}>
        <div className="auth_form_email">
          <div className="auth_form_email_label">{t("email")}</div>
          <input
            autoFocus
            onKeyDown={handleEnterEmailDown}
            value={email}
            type="text"
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
    </div>
  )
}

export default Auth
