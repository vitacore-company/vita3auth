import { useState } from "react"
import { Tooltip } from "react-tooltip"
import { downloadAsFile } from "../../utils/utils"
import { IModal } from "../../types"

const Modal = ({ show, onOk, onCancel, onFinish }: IModal) => {
  const [loginHash, setLoginHash] = useState("")

  const createWallet = async () => {
    const uuid = await onOk()
    setLoginHash(uuid)
  }

  const saveCode = async (type: string) => {
    switch (type) {
      case "file":
        downloadAsFile(loginHash)
        onFinish()
        onCancel()
        break
      case "buffer":
        await navigator.clipboard.writeText(loginHash)
        onFinish()
        onCancel()
        break
      default:
        break
    }
  }

  return show ? (
    <div className="modal">
      <div className="modal_content">
        {loginHash ? (
          <>
            <div className="modal_content_label">
              Сохраните номер уникального кода
            </div>
            <div className="modal_content_save">
              <div
                onClick={() => saveCode("file")}
                data-tooltip-id="download-tooltip"
                data-tooltip-content="Скачайте код файлом"
                className="modal_content_save_btn"
              >
                &#x2193;
              </div>
              <div
                onClick={() => saveCode("buffer")}
                data-tooltip-id="download-tooltip"
                data-tooltip-content="Сохраните код в буффер"
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
            <div onClick={createWallet} className="modal_content_btn">
              Создать новый кошелек
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
