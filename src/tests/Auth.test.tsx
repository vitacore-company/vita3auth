import { fireEvent, render, screen } from "@testing-library/react"
import Auth from "../components/Auth/Auth"

describe("main test", () => {
  test("Auth", () => {
    const log = (eoa: any) => console.log(eoa.privateKey)
    render(
      <Auth
        onEOAchange={log}
        label={"test"}
        language="ru"
        saveCodeExternal={[]}
        addCodeExternal={[]}
        test={true}
      />
    )

    const loginBtn = screen.getByTestId("enter")
    const email: HTMLInputElement = screen.getByTestId("email")
    const password: HTMLInputElement = screen.getByTestId("password")
    fireEvent.change(email, { target: { value: "test@gmail.com" } })
    fireEvent.change(password, { target: { value: "test" } })
    fireEvent.click(loginBtn)
  })
})
