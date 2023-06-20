import { Wallet, ethers } from "ethers"
import { useEffect, useState, useRef, ChangeEvent } from "react"
import { useAuthContext, withAuthContext } from "../context/AuthContext"
import { useTranslation } from "react-i18next"
import {
  checkEmail,
  checkLoginSalt,
  downloadAsFile,
  getCryptoHash,
  readFromBuffer,
  tooltipStyle,
  uploadFile,
  writeToBuffer,
} from "../../utils/utils"
import { AuthI, IauthError } from "../../types"
import { v4 as uuidv4 } from "uuid"
import { Tooltip } from "react-tooltip"
import Ellipse from "../Ellipse/Ellipse"
import i18n from "../../utils/translation"
import Modal from "../Modal/Modal"

function Auth(props: AuthI) {
  const { onEOAchange, label, language } = props
  const { t } = useTranslation()
  const { setMessage } = useAuthContext()
  const fileInputRef: any = useRef(null)
  const [modalShow, setModalShow] = useState(false)
  const [eoaWallet, setEOAWallet] = useState<Wallet>()
  const [email, setEmail] = useState<string>(
    localStorage.getItem("email") || ""
  )
  const [password, setPassword] = useState<string>(
    localStorage.getItem("password") || ""
  )
  const [loginSalt, setLoginSalt] = useState<string | null>(
    localStorage.getItem("loginSalt") || null
  )
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
      generateWallet(loginSalt)
    }
  }

  const generateWallet = async (loginSalt?: string) => {
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
    setEmail("")
    setPassword("")
    return currentLoginSalt
  }

  const modalCancel = () => {
    setModalShow(false)
  }

  const sendEOA = (wallet?: Wallet) => {
    if (wallet) {
      onEOAchange(wallet)
    } else {
      onEOAchange(eoaWallet!)
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

  useEffect(() => {
    if (loginSalt) {
      setMessage({
        text: `${t("hashAdded")}: ${loginSalt.slice(0, 3)}...`,
        type: "success",
      })
    }
  }, [loginSalt, setMessage, t])

  const copyToBuffer = async () => {
    writeToBuffer(loginSalt!)
    setMessage({ text: "copied", type: "success" })
  }

  const downloadSalt = () => {
    downloadAsFile(loginSalt!)
    setMessage({ text: "downloaded", type: "success" })
  }

  const getSaltFromFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file: any = await uploadFile(e.target.files && e.target.files[0])
    if (file) {
      setLoginSalt(file)
    } else {
      setMessage({ text: "failed upload", type: "error" })
    }
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

  const fileUploadClick = () => {
    fileInputRef.current?.click()
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
              <div className="tooltip_btn" onClick={copyToBuffer}>
                Скопировать в буффер
              </div>
              <div className="tooltip_btn" onClick={downloadSalt}>
                Загрузить файлом
              </div>
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
              <input
                type="file"
                ref={fileInputRef}
                onChange={getSaltFromFile}
                className="tooltip_btn_file"
              />
            </>
          )}
        </Tooltip>
      </div>
      <div onClick={handleAuth} className="auth_submit">
        <div className="auth_submit_label">{t("login")}</div>
      </div>
      <Ellipse className="auth_ellipse1" />
      <Ellipse className="auth_ellipse2" />
      <Modal
        onOk={generateWallet}
        show={modalShow}
        onCancel={modalCancel}
        onFinish={sendEOA}
        setLoginSalt={setLoginSalt}
        loginSalt={loginSalt || ""}
      />
    </div>
  )
}

export default withAuthContext(Auth)
