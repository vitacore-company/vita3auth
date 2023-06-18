import { IAddressEOA } from "../../types"
import { ReactComponent as MetamaskLogo } from "../../assets/metamask.svg"
import { ReactComponent as CopyLogo } from "../../assets/copy.svg"
import { parseAccount } from "../../utils/utils"
import { Tooltip } from "react-tooltip"
import { useEffect, useState } from "react"

const AddressEOA = (props: IAddressEOA) => {
  const { address, noAddressLabel } = props
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(address || "")
    setCopied(true)
  }

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 1000)
    }
  }, [copied])

  return address ? (
    <>
      <div className="address">
        {copied && <div className="address_copied">COPIED</div>}
        <MetamaskLogo />
        <div className="address_number">{address && parseAccount(address)}</div>
        <div
          data-tooltip-id="copy-tooltip"
          data-tooltip-content="copy"
          className="address_copy"
          onClick={copy}
        >
          <CopyLogo />
        </div>
      </div>
      <Tooltip
        id="copy-tooltip"
        style={{
          backgroundColor: "rgba(39, 41, 39, 0.681)",
          color: "#ffffff",
          borderRadius: "15px",
        }}
      />
    </>
  ) : (
    <div className="address-no">{noAddressLabel || "No Wallet"}</div>
  )
}

export default AddressEOA
