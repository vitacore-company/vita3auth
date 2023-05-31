import { useEffect, useState } from "react"
import Auth from "../Auth/Auth"
import { walletEOAState } from "../../types"
import AddressEOA from "../AddressEOA/AddressEOA"

function App() {
  const [walletEOA, setWalletEOA] = useState<walletEOAState>(null)

  useEffect(() => {
    console.log("walletEOA", walletEOA)
  }, [walletEOA])

  return (
    <div className="app">
      <Auth onEOAchange={setWalletEOA} />
      <div style={{ position: "absolute", top: 10, left: 10 }}>
        <AddressEOA address="0x840bEc189516EC2eE70a273FCf3885e0912823DA" />
      </div>
    </div>
  )
}

export default App
