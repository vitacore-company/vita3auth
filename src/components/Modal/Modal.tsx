import { useRef, useState } from "react"
import { Tooltip } from "react-tooltip"
import {
  downloadCodeAsFile,
  tooltipStyle,
  writeCodeToBuffer,
} from "../../utils/utils"
import { IModal } from "../../types"
import { useAuthContext } from "../Auth/AuthContext"
import Upload from "../Upload/Upload"
import { v4 as uuidv4 } from "uuid"

const Modal = ({ closeModal }: IModal) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [step2, setStep2] = useState<string | null>(null)
  const { loginSalt, setLoginSalt, writeLoginSalt, generateWallet } =
    useAuthContext()

  const fileUploadClick = () => {
    fileInputRef.current?.click()
  }

  const createWallet = async () => {
    setLoginSalt(uuidv4())
    setStep2("save")
  }

  const addCode = () => {
    setStep2("add")
  }

  const actCode = async (type: string) => {
    if (step2 === "save") {
      switch (type) {
        case "file":
          downloadCodeAsFile(loginSalt!)
          closeModal()
          generateWallet()
          break
        case "buffer":
          await writeCodeToBuffer(loginSalt!)
          closeModal()
          generateWallet()
          break
        default:
          break
      }
    }
    if (step2 === "add") {
      switch (type) {
        case "file":
          fileUploadClick()
          break
        case "buffer":
          if (await writeLoginSalt()) closeModal()
          break
        default:
          break
      }
    }
  }

  return (
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

              <Upload uploadRef={fileInputRef} onFinish={closeModal} />
              <Tooltip id="download-tooltip" style={tooltipStyle} />
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
            <div onClick={closeModal} className="modal_content_close">
              <div className="modal_content_close_icon">
                <>&#x2715;</>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Modal
