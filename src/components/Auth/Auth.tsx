import { ethers } from "ethers"
import { useEffect, useState, useRef } from "react"
import { getCryptoHash } from "../../utils/utils"
import { AuthI, walletEOAState } from "../../types"
import Ellipse from "../Ellipse/Ellipse"

function Auth(props: AuthI) {
  const { onEOAchange } = props
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
      console.log("auth start")
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

  return (
    <div className="auth">
      <div className="auth_label">Войти</div>
      <div className={`auth_form ${authError && "auth_form-error"}`}>
        <div className="auth_form_email">
          <div className="auth_form_email_label">Логин</div>
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
          <div className="auth_form_password_label">Пароль</div>
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
        <div className="auth_submit_label">Войти</div>
      </div>
      <Ellipse className="auth_ellipse1" />
      <Ellipse className="auth_ellipse2" />
    </div>
  )
}

export default Auth
