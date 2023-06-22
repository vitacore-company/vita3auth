import { useTranslation } from "react-i18next"
import { INotify } from "../../types"
import { memo, useEffect } from "react"

const Notify = ({ message }: INotify) => {
  const { t } = useTranslation()

  useEffect(() => {
    console.log("message", message)
  }, [message])

  return (
    message && (
      <div
        key={Math.random()}
        className="notify"
        style={{
          background:
            message.type === "success"
              ? "rgba(80, 225, 36, 0.267)"
              : "rgba(225, 36, 36, 0.267)",
        }}
      >
        <div className="notify_icon">
          {message.type === "success" ? <>&#10003;</> : <>&#10006;</>}
        </div>
        <div className="notify_info">
          <div className="notify_info_title">
            {message.type === "success"
              ? t("notifyLabelSuccess")
              : t("notifyLabelError")}
          </div>
          <div className="notify_info_text">{message.text}</div>
        </div>
      </div>
    )
  )
}

export default memo(Notify)
