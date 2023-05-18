import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { getCryptoHash } from "../../utils/utils"

function Auth(props: any) {
  const { onEOAchange } = props
  const [email, setEmail] = useState("")
  const [walletEOA, setWalletEOA] = useState<any>()

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value)
  }

  const handleEnterDown = (e: any) => {
    if (e.key === "Enter") {
      handleAuth()
    }
  }

  const handleAuth = async () => {
    if (email) {
      const userPrivateKey = await getCryptoHash(email)
      console.log(`User private key: ${userPrivateKey}`)
      const newUserWallet: any = new ethers.Wallet(userPrivateKey)
      console.log("newUserWallet", newUserWallet)
      setWalletEOA(newUserWallet)
      onEOAchange(newUserWallet)
      setEmail("")
    }
  }

  useEffect(() => {
    console.log("email", email)
  }, [email])

  return (
    <div className="app">
      <div className="input">
        <div className="input_label">Enter email</div>
        <div className="input_form">
          <input
            onKeyDown={(e) => handleEnterDown(e)}
            value={email}
            type="text"
            className="input_form_field"
            onChange={handleEmailChange}
          />
          <div className="input_form_btn">
            <div onClick={handleAuth}>Go</div>
          </div>
        </div>
      </div>
      {walletEOA && <div className="address">EOA {walletEOA.address}</div>}
    </div>
  )
}

export default Auth
