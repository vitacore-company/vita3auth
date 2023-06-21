import { useRef } from "react"
import { useAuthContext } from "../Auth/AuthContext"
import { useTranslation } from "react-i18next"
import Upload from "../Upload/Upload"

const Code = () => {
  const { loginSalt, setLoginSalt, writeLoginSalt } = useAuthContext()

  const { t } = useTranslation()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const fileUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`code ${loginSalt ? "code-filled" : "code-empty"}`}>
      <div className="code_label">
        {loginSalt
          ? t("hashAdded") || "code was added"
          : t("noHash") || "no code"}
      </div>
      <div className="code_content">
        <div className="code_content_btn" onClick={writeLoginSalt}>
          Скопировать из буффера
        </div>
        <div className="code_content_btn" onClick={fileUploadClick}>
          Загрузить из файла
        </div>
        {loginSalt && (
          <div
            className="code_content_btn code_content_btn-change"
            onClick={() => setLoginSalt(null)}
          >
            Удалить код
          </div>
        )}
        <Upload uploadRef={fileInputRef} />
      </div>
    </div>
  )
}

export default Code
