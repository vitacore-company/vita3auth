import { ChangeEvent, useRef, useState } from "react"
import { Tooltip } from "react-tooltip"
import {
  checkLoginSalt,
  downloadAsFile,
  readFromBuffer,
  uploadFile,
  writeToBuffer,
} from "../../utils/utils"
import { IModal } from "../../types"
import { t } from "i18next"
import { useAuthContext } from "../context/AuthContext"

const Modal = ({
  show,
  onOk,
  onCancel,
  onFinish,
  setLoginSalt,
  loginSalt,
}: IModal) => {
  const fileInputRef: any = useRef(null)

  const [step2, setStep2] = useState<string | null>(null)
  const { setMessage } = useAuthContext()

  const getSaltFromFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file: any = await uploadFile(e.target.files && e.target.files[0])
    console.log(file)

    if (file) {
      setLoginSalt(file)
      onFinish()
      onCancel()
    } else {
      setMessage({ text: "failed upload", type: "error" })
    }
  }

  const fileUploadClick = () => {
    fileInputRef.current?.click()
  }

  const createWallet = async () => {
    const uuid = await onOk()
    setLoginSalt(uuid)
    setStep2("save")
  }

  const addCode = () => {
    setStep2("add")
  }

  const actCode = async (type: string) => {
    if (step2 === "save") {
      switch (type) {
        case "file":
          downloadAsFile(loginSalt)
          onFinish()
          onCancel()
          break
        case "buffer":
          await writeToBuffer(loginSalt)
          onFinish()
          onCancel()
          break
        default:
          break
      }
    } else {
      switch (type) {
        case "file":
          fileUploadClick()

          break
        case "buffer":
          const clipboardText = await readFromBuffer()
          const checkedSalt = checkLoginSalt(clipboardText)
          if (checkedSalt) {
            setLoginSalt(clipboardText)
            onFinish()
            onCancel()
          } else {
            setMessage({ text: t("wrongHash"), type: "error" })
          }

          break
        default:
          break
      }
    }
  }

  return show ? (
    <div className="modal">
      <div className="modal_content">
        {step2 ? (
          <>
            <div className="modal_content_label">
              {step2 === "save"
                ? "Сохраните номер уникального кода"
                : "Добавьте номер уникального кода"}
            </div>
            <div className="modal_content_save">
              <div
                onClick={() => actCode("file")}
                data-tooltip-id="download-tooltip"
                data-tooltip-content={
                  step2 === "save"
                    ? "Скачайте код файлом"
                    : "Добавьте код файлом"
                }
                className="modal_content_save_btn"
              >
                &#x2193;
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={getSaltFromFile}
                className="modal_content_save_input"
              />
              <div
                onClick={() => actCode("buffer")}
                data-tooltip-id="download-tooltip"
                data-tooltip-content={
                  step2 === "save"
                    ? " Сохраните код в буффер"
                    : "Добавьте код из буффера"
                }
                className="modal_content_save_btn"
              >
                B
              </div>
              <Tooltip
                id="download-tooltip"
                style={{
                  backgroundColor: "rgba(39, 41, 39, 0.681)",
                  color: "#ffffff",
                  borderRadius: "15px",
                }}
              />
            </div>
          </>
        ) : (
          <>
            <div className="modal_content_label">
              Регистрация нового кошелька
            </div>
            <div className="modal_content_desc">
              Вы входите без указания уникального кода, будет создан новый
              кошелек. Хотите продолжить?
            </div>
            <div className="modal_content_btns">
              <div onClick={createWallet} className="modal_content_btns_new">
                Создать новый кошелек
              </div>
              <div onClick={addCode} className="modal_content_btns_code">
                Вставить код
              </div>
            </div>
            <div onClick={onCancel} className="modal_content_close">
              <div className="modal_content_close_icon">
                <>&#x2715;</>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  ) : (
    <div />
  )
}

export default Modal
