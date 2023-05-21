import { useEffect, useState } from "react"
import Auth from "../Auth/Auth"
import { walletEOAState } from "src/types"

function App() {
  const [walletEOA, setWalletEOA] = useState<walletEOAState>(null)

  useEffect(() => {
    console.log("walletEOA", walletEOA)
  }, [walletEOA])

  return (
    <div className="app">
      <Auth onEOAchange={setWalletEOA} />
    </div>
  )
}

export default App
