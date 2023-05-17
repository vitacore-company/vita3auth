import { ethers } from "ethers"
import { useEffect, useState } from "react"

import { getCryptoHash } from "../utils/utils"

function Auth() {
  const [email, setEmail] = useState("")
  const [walletEOA, setWalletEOA] = useState()

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handleEnterDown = (e) => {
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
