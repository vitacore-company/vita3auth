import { INotify } from "../../types"

const Notify = ({ message, label }: INotify) => {
  return (
    <div className="notify">
      <div className="notify_icon">
        <>&#10006;</>
      </div>
      <div className="notify_info">
        <div className="notify_info_title">{label}</div>
        <div className="notify_info_text">{message}</div>
      </div>
    </div>
  )
}

export default Notify
