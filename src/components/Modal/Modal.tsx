import { useRef, useState } from "react"
import { Tooltip } from "react-tooltip"
import { tooltipStyle } from "../../utils/utils"
import { IModal } from "../../types"
import { useAuthContext } from "../Auth/AuthContext"
import { v4 as uuidv4 } from "uuid"
import Upload from "../Upload/Upload"

const Modal = ({ closeModal }: IModal) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [step2, setStep2] = useState<string | null>(null)
  const { setLoginSalt, generateWallet, saveCodeMethods, writeLoginSalt } =
    useAuthContext()

  const addCodeMethods = [
    { label: "Подгрузить файлом", fn: () => fileInputRef.current?.click() },
    {
      label: "Добавить код из буффера",
      fn: () => {
        writeLoginSalt()
        closeModal()
      },
    },
  ]

  const generateLoginSalt = async () => {
    setLoginSalt(uuidv4())
    setStep2("save")
  }

  const saveCode = (fn: any) => {
    fn()
    closeModal()
    generateWallet()
  }

  return (
    <div className="modal">
      <div className="modal_content">
        {step2 ? (
          step2 === "save" ? (
            <>
              <div className="modal_content_label">
                Сохраните номер уникального кода
              </div>
              <div className="modal_content_save">
                {saveCodeMethods.map((method: any, i: number) => (
                  <div
                    key={i}
                    onClick={() => saveCode(method.fn)}
                    data-tooltip-id="save-tooltip"
                    data-tooltip-content={method.label}
                    className="modal_content_save_btn"
                  >
                    copy
                  </div>
                ))}
                <Tooltip id="save-tooltip" style={tooltipStyle} />
              </div>
            </>
          ) : (
            <>
              <div className="modal_content_label">
                Добавьте номер уникального кода
              </div>
              <div className="modal_content_save">
                {addCodeMethods.map((method: any, i: number) => (
                  <div
                    key={i}
                    onClick={method.fn}
                    data-tooltip-id="add-tooltip"
                    data-tooltip-content={method.label}
                    className="modal_content_save_btn"
                  >
                    add
                  </div>
                ))}
                <Tooltip id="add-tooltip" style={tooltipStyle} />
              </div>
              <Upload uploadRef={fileInputRef} onFinish={closeModal} />
            </>
          )
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
              <div
                onClick={generateLoginSalt}
                className="modal_content_btns_new"
              >
                Создать новый кошелек
              </div>
              <div
                onClick={() => setStep2("add")}
                className="modal_content_btns_code"
              >
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
