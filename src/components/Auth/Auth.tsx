import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { getCryptoHash } from "../../utils/utils"
import { AuthI, walletEOAState } from "../../types"

function Auth(props: AuthI) {
  const { onEOAchange } = props
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [walletEOA, setWalletEOA] = useState<walletEOAState>(null)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleEnterDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAuth()
    }
  }

  const handleAuth = async () => {
    if (email) {
      const userPrivateKey = await getCryptoHash(email)
      console.log(`User private key: ${userPrivateKey}`)
      const newUserWallet = new ethers.Wallet(userPrivateKey)
      console.log("newUserWallet", newUserWallet)
      setWalletEOA(newUserWallet)
      onEOAchange(newUserWallet)
      setEmail("")
    }
  }

  useEffect(() => console.log("walletEOA", walletEOA), [walletEOA])

  useEffect(() => {
    console.log("email", email)
  }, [email])

  return (
    <div className="auth">
      <div className="auth_label">Войти</div>
      <div className="auth_form">
        <div className="auth_form_email">
          <div className="auth_form_email_label">Логин</div>
          <input
            onKeyDown={handleEnterDown}
            value={email}
            type="text"
            className="auth_form_email_input"
            onChange={handleEmailChange}
          />
        </div>
        <div className="auth_form_password">
          <div className="auth_form_password_label">Пароль</div>
          <input
            onKeyDown={handleEnterDown}
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
      <div className="auth_ellipse1" />
      <div className="auth_ellipse2" />
    </div>
  )
}

export default Auth
