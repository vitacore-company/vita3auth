import { useState } from "react"
import { IModal } from "../../types"
import { useAuthContext } from "../Auth/AuthContext"
import { v4 as uuidv4 } from "uuid"
import Step2 from "./Step2"

const Modal = ({ closeModal }: IModal) => {
  const [step2, setStep2] = useState<string | null>(null)
  const { setLoginSalt, generateWallet, saveCodeMethods, addCodeMethods } =
    useAuthContext()

  const generateLoginSalt = async () => {
    setLoginSalt(uuidv4())
    setStep2("save")
  }

  const saveCode = async (fn: () => void) => {
    await fn()
    closeModal()
    generateWallet()
  }

  const addCode = async (fn: () => void) => {
    await fn()
    closeModal()
  }

  return (
    <div className="modal">
      <div className="modal_content">
        {step2 ? (
          step2 === "save" ? (
            <Step2
              title="Сохраните номер уникального кода"
              methodList={saveCodeMethods}
              callback={saveCode}
            />
          ) : (
            <Step2
              title=" Добавьте номер уникального кода"
              methodList={addCodeMethods}
              callback={addCode}
            />
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
