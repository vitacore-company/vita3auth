import { useEffect, useState, useRef } from "react"
import { useAuthContext, withAuthContext } from "./AuthContext"
import { useTranslation } from "react-i18next"
import { checkEmail } from "../../utils/utils"
import { IAuth, IauthError } from "../../types"
import Ellipse from "../Ellipse/Ellipse"
import Code from "../Code/Code"

function Auth(props: IAuth) {
  const { label } = props
  const { t } = useTranslation()
  const {
    setMessage,
    setModalShow,
    loginSalt,
    generateWallet,
    email,
    setEmail,
    password,
    setPassword,
  } = useAuthContext()

  const [authError, setAuthError] = useState<IauthError>({ status: false })

  const passwordInput = useRef<HTMLInputElement | null>(null)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleEnterEmailDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (checkEmail(email)) {
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
    setMessage({ text: message, type: "error" })
  }

  const handleAuth = async () => {
    if (!checkEmail(email)) {
      activateAuthError(t("wrongEmail"))
      return
    }
    if (!password) {
      activateAuthError(t("lackData"))
      return
    }
    if (!loginSalt) {
      setModalShow(true)
      return
    } else {
      generateWallet()
    }
  }

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
            autoComplete="new-password"
            onKeyDown={handleEnterPasswordDown}
            value={password}
            type="password"
            className="auth_form_password_input"
            onChange={handlePasswordChange}
          />
        </div>
      </div>
      <div onClick={handleAuth} className="auth_submit">
        <div className="auth_submit_label">{t("login")}</div>
      </div>
      <Code />
      <Ellipse className="auth_ellipse1" />
      <Ellipse className="auth_ellipse2" />
    </div>
  )
}

export default withAuthContext(Auth)
