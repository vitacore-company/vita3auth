import { ethers } from "ethers"
import { sha256 } from "crypto-hash"

import { provider } from "./constants"

export function createWallet(privateKey) {
  const userWallet = new ethers.Wallet(privateKey)
  const connectedWallet = userWallet.connect(provider)
  return connectedWallet
}

export const getCryptoHash = async (email) => {
  const cryptoHash = await sha256(email)
  return cryptoHash
}
