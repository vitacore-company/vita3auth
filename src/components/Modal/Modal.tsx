import { useState } from "react"
import { IModal } from "../../types"
import { useAuthContext } from "../Auth/AuthContext"
import { v4 as uuidv4 } from "uuid"
import ModalBtn from "./ModalBtn"

const Modal = ({ closeModal }: IModal) => {
  const [step2, setStep2] = useState<string | null>(null)
  const { setLoginSalt, generateWallet, saveCodeMethods, addCodeMethods } =
    useAuthContext()

  const generateLoginSalt = async () => {
    setLoginSalt(uuidv4())
    setStep2("save")
  }

  const saveCode = (fn: () => void) => {
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
                {saveCodeMethods.map(({ fn, label, icon }, i: number) => (
                  <ModalBtn
                    key={i}
                    fn={() => saveCode(fn)}
                    label={label}
                    icon={icon}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="modal_content_label">
                Добавьте номер уникального кода
              </div>
              <div className="modal_content_save">
                {addCodeMethods.map(({ fn, label, icon }, i: number) => (
                  <ModalBtn key={i} fn={fn} label={label} icon={icon} />
                ))}
              </div>
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
