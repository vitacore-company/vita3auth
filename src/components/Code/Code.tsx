import { useAuthContext } from "../Auth/AuthContext"
import { useTranslation } from "react-i18next"

const Code = () => {
  const { loginSalt, setLoginSalt, addCodeMethods } = useAuthContext()

  const { t } = useTranslation()

  return (
    <div
      className={`code ${loginSalt ? "code-filled" : "code-empty"}`}
      data-testid="code"
    >
      <div className="code_label">
        {loginSalt
          ? t("hashAdded") || "code was added"
          : t("noHash") || "no code"}
      </div>
      <div className="code_content">
        {addCodeMethods.map(({ label, fn }, i: number) => {
          return (
            <div
              key={i}
              data-testid={label}
              className="code_content_btn"
              onClick={fn}
            >
              {label}
            </div>
          )
        })}

        {loginSalt && (
          <div
            className="code_content_btn code_content_btn-change"
            onClick={() => setLoginSalt(null)}
          >
            {t("removeCode")}
          </div>
        )}
      </div>
    </div>
  )
}

export default Code
