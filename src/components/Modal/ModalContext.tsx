import { useState, createContext, useContext, useEffect } from "react"
import Modal from "./Modal"

export const ModalContext = createContext<any>(null)

export const ModalContextProvider = ({ children }: any) => {
  const [show, setShow] = useState<any>(false)
  const [onOk, setOnOk] = useState<any>()

  useEffect(() => {
    console.log("show", show)
  }, [show])

  return (
    <ModalContext.Provider value={{ setShow }}>
      {show && <Modal setShow={setShow} />}
      {children}
    </ModalContext.Provider>
  )
}

export const withModalContext = (Component: (props: any) => JSX.Element) => {
  const EnhancedComponent = (props: any) => {
    return (
      <ModalContextProvider>
        <Component {...props} />
      </ModalContextProvider>
    )
  }
  return EnhancedComponent
}

export const useModalContext = () => useContext(ModalContext)
