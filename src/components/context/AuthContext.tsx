import { useState, createContext, useContext, useEffect } from "react"
import Notify from "../Notify/Notify"
import {
  AuthI,
  IMessage,
  IAuthContext,
  IAuthContextProvider,
} from "../../types"

export const AuthContext = createContext<IAuthContext>({
  setMessage: () => undefined,
})

export const NotifyContextProvider = ({ children }: IAuthContextProvider) => {
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
    <AuthContext.Provider value={{ setMessage }}>
      {message && <Notify message={message} />}
      {children}
    </AuthContext.Provider>
  )
}

export const withAuthContext = (Component: (props: AuthI) => JSX.Element) => {
  const EnhancedComponent = (props: AuthI) => {
    return (
      <NotifyContextProvider>
        <Component {...props} />
      </NotifyContextProvider>
    )
  }
  return EnhancedComponent
}

export const useAuthContext = () => useContext(AuthContext)
