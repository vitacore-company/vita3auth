import { useTranslation } from "react-i18next"
import { INotify } from "../../types"

const Notify = ({ message }: INotify) => {
  const { t } = useTranslation()

  return (
    <div key={Math.random()} className="notify">
      <div className="notify_icon">
        <>&#10006;</>
      </div>
      <div className="notify_info">
        <div className="notify_info_title">{t("notifyLabel")}</div>
        <div className="notify_info_text">{message}</div>
      </div>
    </div>
  )
}

export default Notify
