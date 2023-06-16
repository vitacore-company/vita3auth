import { useState, createContext, useContext, useEffect } from "react"
import Notify from "./Notify"
import {
  AuthI,
  IMessage,
  INotifyContext,
  INotifyContextProvider,
} from "../../types"

export const NotifyContext = createContext<INotifyContext>({
  setMessage: () => undefined,
})

export const NotifyContextProvider = ({ children }: INotifyContextProvider) => {
  const [message, setMessage] = useState<IMessage | null>(null)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (message) {
      timeout = setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
    return () => {
      clearTimeout(timeout)
    }
  }, [message])

  return (
    <NotifyContext.Provider value={{ setMessage }}>
      {message && <Notify message={message} />}
      {children}
    </NotifyContext.Provider>
  )
}

export const withNotifyContext = (Component: (props: AuthI) => JSX.Element) => {
  const EnhancedComponent = (props: AuthI) => {
    return (
      <NotifyContextProvider>
        <Component {...props} />
      </NotifyContextProvider>
    )
  }
  return EnhancedComponent
}

export const useNotifyContext = () => useContext(NotifyContext)
