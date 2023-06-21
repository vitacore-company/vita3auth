import { useEffect, useState, useRef } from "react"
import { useAuthContext, withAuthContext } from "./AuthContext"
import { useTranslation } from "react-i18next"
import { checkEmail, tooltipStyle } from "../../utils/utils"
import { IAuth, IauthError } from "../../types"
import { Tooltip } from "react-tooltip"
import Ellipse from "../Ellipse/Ellipse"
import Upload from "../Upload/Upload"

function Auth(props: IAuth) {
  const { label } = props
  const { t } = useTranslation()
  const {
    setMessage,
    setModalShow,
    loginSalt,
    setLoginSalt,
    generateWallet,
    writeLoginSalt,
    email,
    setEmail,
    password,
    setPassword,
    saveCodeMethods,
  } = useAuthContext()
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const fileUploadClick = () => {
    fileInputRef.current?.click()
  }

  const saveCode = (fn: () => void) => {
    fn()
    setMessage({ text: "saved", type: "success" })
  }

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
        <div
          data-tooltip-id="salt-tooltip"
          className={`auth_form_hash ${
            loginSalt ? "auth_form_hash-filled" : "auth_form_hash-empty"
          }`}
        >
          S
        </div>
        <Tooltip id="salt-tooltip" clickable style={tooltipStyle}>
          {loginSalt ? (
            <>
              <div className="tooltip_label">
                {t("hashAdded") || "code was added"}
              </div>
              {saveCodeMethods.map((method, i: number) => (
                <div
                  key={i}
                  className="tooltip_btn"
                  onClick={() => saveCode(method.fn)}
                >
                  {method.label}
                </div>
              ))}
              <div className="tooltip_btn" onClick={() => setLoginSalt(null)}>
                Изменить код
              </div>
            </>
          ) : (
            <>
              <div className="tooltip_label">{t("noHash") || "no code"}</div>
              <div className="tooltip_btn" onClick={writeLoginSalt}>
                Скопировать из буффера
              </div>
              <div className="tooltip_btn" onClick={fileUploadClick}>
                Загрузить из файла
              </div>
              <Upload uploadRef={fileInputRef} />
            </>
          )}
        </Tooltip>
      </div>
      <div onClick={handleAuth} className="auth_submit">
        <div className="auth_submit_label">{t("login")}</div>
      </div>
      <Ellipse className="auth_ellipse1" />
      <Ellipse className="auth_ellipse2" />
    </div>
  )
}

export default withAuthContext(Auth)
