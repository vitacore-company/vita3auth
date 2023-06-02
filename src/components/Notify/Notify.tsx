import { createPortal, render } from "react-dom"
import { INotify } from "../../types"
import { useEffect, useState } from "react"

const Notify = ({ message, label }: INotify) => {
  return (
    <div className="notify" id="notify">
      <div className="notify_icon">
        <>&#10006;</>
      </div>
      <div className="notify_info">
        <div className="notify_info_title">{label}</div>
        <div className="notify_info_text">{message}</div>
      </div>
    </div>
  )
}

export const useNotify = () => {
  const [prevNotify, setPrevNotify] = useState<any>()

  useEffect(() => {
    prevNotify?.remove()
    const timeout = setTimeout(() => {
      const currentNotify = document.getElementById("notify")
      currentNotify?.remove()
    }, 3000)
    return () => {
      clearTimeout(timeout)
      // console.log("clear")
    }
  }, [prevNotify])

  const showNotify = (message: string, label: string) => {
    const prevNotifyElem = document.getElementById("notify")
    setPrevNotify(prevNotifyElem)

    const container = document.getElementById("auth")
    render(
      createPortal(
        <Notify message={message} label={label} />,
        container as Element
      ),
      document.createElement("div")
    )
  }
  return [showNotify]
}

export default Notify
