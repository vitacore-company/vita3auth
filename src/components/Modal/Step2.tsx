import { IStep2 } from "../../types"
import ModalBtn from "./ModalBtn"

const Step2 = ({ title, methodList, callback }: IStep2) => {
  return (
    <>
      <div className="modal_content_label">{title}</div>
      <div className="modal_content_save">
        {methodList.map(({ fn, label, icon }, i: number) => (
          <ModalBtn key={i} fn={() => callback(fn)} label={label} icon={icon} />
        ))}
      </div>
    </>
  )
}

export default Step2
