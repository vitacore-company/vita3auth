import { ethers } from "ethers"
import { sha256 } from "crypto-hash"
import { PROVIDER_URL } from "./constants"

export const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL)

export function createWallet(privateKey: string) {
  const userWallet = new ethers.Wallet(privateKey)
  const connectedWallet = userWallet.connect(provider)
  return connectedWallet
}

export const getCryptoHash = async (email: string) => {
  const cryptoHash = await sha256(email)
  return cryptoHash
}

export const parseAccount = (account: string) => {
  const array = account.split("")
  const first10 = array.slice(0, 10)
  const last4 = array.slice(-4)
  const combined = [...first10, ".", ".", ".", ...last4]
  return combined.join("")
}

export function downloadAsFile(data: string) {
  let a = document.createElement("a")
  let file = new Blob([data], { type: "application/json" })
  a.href = URL.createObjectURL(file)
  a.download = "loginCode.txt"
  a.click()
}

export const writeToBuffer = async (text: string) => {
  await navigator.clipboard.writeText(text!)
}

export const readFromBuffer = async () => {
  const clipboardText = await navigator.clipboard.readText()
  const saltRegex =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
  if (saltRegex.test(clipboardText)) {
    return clipboardText
  } else {
    return null
  }
}

export const tooltipStyle = {
  backgroundColor: "rgba(39, 41, 39, 0.681)",
  color: "#ffffff",
  borderRadius: "15px",
}
