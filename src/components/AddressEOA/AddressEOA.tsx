import { IAddressEOA } from "../../types"
import { ReactComponent as MetamaskLogo } from "./metamask.svg"
import { ReactComponent as CopyLogo } from "./copy.svg"
import { parseAccount } from "src/utils/utils"

const AddressEOA = (props: IAddressEOA) => {
  const { address } = props

  const copy = async () => {
    await navigator.clipboard.writeText(address || "")
  }

  return (
    <div className="address">
      {address ? (
        <>
          <MetamaskLogo />
          <div className="address_number">
            {address && parseAccount(address)}
          </div>
          <div className="address_copy" onClick={copy}>
            <CopyLogo />
          </div>
        </>
      ) : (
        <div className="address_no">Кошелек отсутствует</div>
      )}
    </div>
  )
}

export default AddressEOA
