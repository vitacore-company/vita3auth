import { useRef } from "react"
import { tooltipStyle } from "../../utils/utils"
import { useAuthContext } from "../Auth/AuthContext"
import { Tooltip } from "react-tooltip"
import { useTranslation } from "react-i18next"
import Upload from "../Upload/Upload"

const Code = () => {
  const {
    loginSalt,
    setLoginSalt,
    writeLoginSalt,
    saveCodeMethods,
    setMessage,
  } = useAuthContext()

  const { t } = useTranslation()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const fileUploadClick = () => {
    fileInputRef.current?.click()
  }

  const saveCode = (fn: () => void) => {
    fn()
    setMessage({ text: "saved", type: "success" })
  }

  return (
    <div className={`code ${loginSalt ? "code-filled" : "code-empty"}`}>
      <div className="code_label">
        {loginSalt
          ? t("hashAdded") || "code was added"
          : t("noHash") || "no code"}
      </div>
      <div className="code_content">
        {loginSalt ? (
          <>
            {saveCodeMethods.map((method, i: number) => (
              <div
                key={i}
                className="code_content_btn"
                onClick={() => saveCode(method.fn)}
              >
                {method.label}
              </div>
            ))}
            <div
              className="code_content_btn code_content_btn-change"
              onClick={() => setLoginSalt(null)}
            >
              Изменить код
            </div>
          </>
        ) : (
          <>
            <div className="code_content_btn" onClick={writeLoginSalt}>
              Скопировать из буффера
            </div>
            <div className="code_content_btn" onClick={fileUploadClick}>
              Загрузить из файла
            </div>
            <Upload uploadRef={fileInputRef} />
          </>
        )}
      </div>
    </div>
  )
}

export default Code
