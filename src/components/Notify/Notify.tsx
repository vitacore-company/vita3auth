import { useTranslation } from "react-i18next"
import { INotify } from "../../types"

const Notify = ({ message }: INotify) => {
  const { t } = useTranslation()
  const { text, type } = message

  return (
    <div
      key={Math.random()}
      className="notify"
      style={{
        background:
          type === "success"
            ? "rgba(80, 225, 36, 0.267)"
            : "rgba(225, 36, 36, 0.267)",
      }}
    >
      <div className="notify_icon">
        {type === "success" ? <>&#10003;</> : <>&#10006;</>}
      </div>
      <div className="notify_info">
        <div className="notify_info_title">
          {type === "success" ? t("notifyLabelSuccess") : t("notifyLabelError")}
        </div>
        <div className="notify_info_text">{text}</div>
      </div>
    </div>
  )
}

export default Notify
