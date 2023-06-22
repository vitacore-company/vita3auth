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

export function downloadCodeAsFile(data: string) {
  let a = document.createElement("a")
  let file = new Blob([data], { type: "application/json" })
  a.href = URL.createObjectURL(file)
  a.download = "loginCode.txt"
  a.click()
}

export const writeCodeToBuffer = async (text: string) => {
  await navigator.clipboard.writeText(text!)
}

export const readFromBuffer = async () => {
  const clipboardText = await navigator.clipboard.readText()
  return clipboardText
}

export const uploadFile = (): Promise<File | null> => {
  return new Promise((resolve) => {
    let input = document.createElement("input")
    input.type = "file"
    input.onchange = (e: Event) => {
      const files = (e.target as HTMLInputElement).files
      if (files) {
        resolve(files[0])
      } else {
        resolve(null)
      }
    }
    input.click()
  })
}

export const readFile = (file: FileList[0] | null): Promise<string | null> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const checkedLoginSalt = checkLoginSalt(event.target?.result as string)
      if (checkedLoginSalt) {
        resolve(checkedLoginSalt)
      } else {
        resolve(null)
      }
    }
    if (file) {
      reader.readAsText(file)
    } else {
      resolve(null)
    }
  })
}

export const checkLoginSalt = (loginSalt: string) => {
  const saltRegex =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
  if (saltRegex.test(loginSalt)) {
    return loginSalt
  } else {
    return null
  }
}

export const checkEmail = (email: string) => {
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/
  if (emailRegex.test(email)) {
    return true
  }
  return false
}

export const tooltipStyle = {
  backgroundColor: "rgba(39, 41, 39, 0.681)",
  color: "#ffffff",
  borderRadius: "15px",
}
