import { IAddressEOA } from "../../types"
import { ReactComponent as MetamaskLogo } from "../../assets/metamask.svg"
import { ReactComponent as CopyLogo } from "../../assets/copy.svg"
import { parseAccount } from "../../utils/utils"

const AddressEOA = (props: IAddressEOA) => {
  const { address, noAddressLabel } = props

  const copy = async () => {
    await navigator.clipboard.writeText(address || "")
  }

  return address ? (
    <div className="address">
      <MetamaskLogo />
      <div className="address_number">{address && parseAccount(address)}</div>
      <div className="address_copy" onClick={copy}>
        <CopyLogo />
      </div>
    </div>
  ) : (
    <div className="address-no">{noAddressLabel || "No Wallet"}</div>
  )
}

export default AddressEOA
