import { useMemo } from "react"
import { tooltipStyle } from "../../utils/utils"
import { Tooltip } from "react-tooltip"
import { IModalBtn } from "../../types"

const ModalBtn = (props: IModalBtn) => {
  const { fn, label, icon } = props

  const tooltipId = useMemo(() => `${label}-tooltip`, [label])

  return (
    <>
      <div
        onClick={fn}
        data-testid={label}
        data-tooltip-id={tooltipId}
        data-tooltip-content={label}
        className="modal_content_save_btn"
      >
        {icon()}
      </div>
      <Tooltip id={tooltipId} style={tooltipStyle} />
    </>
  )
}

export default ModalBtn
