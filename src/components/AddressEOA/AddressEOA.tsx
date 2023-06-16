import { IAddressEOA } from "../../types"
import { ReactComponent as MetamaskLogo } from "../../assets/metamask.svg"
import { ReactComponent as CopyLogo } from "../../assets/copy.svg"
import { parseAccount } from "../../utils/utils"
import { Tooltip } from "react-tooltip"

const AddressEOA = (props: IAddressEOA) => {
  const { address, noAddressLabel } = props

  const copy = async () => {
    await navigator.clipboard.writeText(address || "")
  }

  return address ? (
    <div className="address">
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
      <Tooltip
        id="copy-tooltip"
        style={{
          backgroundColor: "rgba(39, 41, 39, 0.681)",
          color: "#ffffff",
          borderRadius: "15px",
        }}
      />
    </div>
  ) : (
    <div className="address-no">{noAddressLabel || "No Wallet"}</div>
  )
}

export default AddressEOA
