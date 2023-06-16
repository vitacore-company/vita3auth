const Modal = ({ setShow }: any) => {
  const closeModal = () => {
    setShow(false)
  }

  return (
    <div className="modal">
      <div className="modal_content">
        <div className="modal_content_label">Регистрация нового кошелька</div>
        <div className="modal_content_desc">
          Вы входите без указания уникального кода, будет создан новый кошелек.
          Хотите продолжить?
        </div>
        <div className="modal_content_btn">Создать новый кошелек</div>
        <div onClick={closeModal} className="modal_content_close">
          <div className="modal_content_close_icon">
            <>&#x2715;</>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
