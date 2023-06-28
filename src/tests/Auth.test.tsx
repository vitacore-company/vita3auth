/* eslint-disable testing-library/no-wait-for-side-effects */
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import Auth from "../components/Auth/Auth"
import { Wallet } from "ethers"

describe("main test", () => {
  const enterClick = () => {
    const loginBtn = screen.getByTestId("enter")
    expect(loginBtn).toBeInTheDocument()
    const email: HTMLInputElement = screen.getByTestId("email")
    expect(email).toBeInTheDocument()
    const password: HTMLInputElement = screen.getByTestId("password")
    expect(password).toBeInTheDocument()
    fireEvent.change(email, { target: { value: "test@gmail.com" } })
    expect(email.value).toEqual("test@gmail.com")
    fireEvent.change(password, { target: { value: "test" } })
    expect(password.value).toEqual("test")
    fireEvent.click(loginBtn)
  }
  test("generating new wallet", async () => {
    let privateKey: string | null = null
    const log = (eoa: Wallet) => {
      privateKey = eoa.privateKey
    }
    render(
      <Auth
        onEOAchange={log}
        label={"test"}
        language="ru"
        saveCodeExternal={[]}
        addCodeExternal={[]}
        test={{ loginSalt: "741c78e8-1c56-425e-aace-35122bdc09a3" }}
      />
    )

    enterClick()
    await waitFor(() =>
      expect(privateKey).toEqual(
        "0x060391f5d0b7d9c1383ef85382cbbf6d24efd463b027be6f29d085c536fa5a1e"
      )
    )
  })
  test("language", async () => {
    const log = (eoa: Wallet) => eoa
    render(
      <Auth
        onEOAchange={log}
        label={"test"}
        language="ru"
        saveCodeExternal={[]}
        addCodeExternal={[]}
        test={{ loginSalt: "741c78e8-1c56-425e-aace-35122bdc09a3" }}
      />
    )

    const mail = screen.getByText("Почта")
    expect(mail).toBeInTheDocument()
  })
  test("label", async () => {
    const log = (eoa: Wallet) => eoa
    render(
      <Auth
        onEOAchange={log}
        label={"test"}
        language="ru"
        saveCodeExternal={[]}
        addCodeExternal={[]}
        test={{ loginSalt: "741c78e8-1c56-425e-aace-35122bdc09a3" }}
      />
    )

    const label = screen.getByText("test")
    expect(label).toBeInTheDocument()
  })
  test("addCodeExternal", async () => {
    const mockCallback = jest.fn(() => "")

    const log = (eoa: Wallet) => eoa

    render(
      <Auth
        onEOAchange={log}
        label={"test"}
        language="ru"
        saveCodeExternal={[]}
        addCodeExternal={[
          {
            label: "testAdd",
            fn: mockCallback,
            icon: () => <div>testAdd</div>,
          },
        ]}
        test={{ loginSalt: "741c78e8-1c56-425e-aace-35122bdc09a3" }}
      />
    )

    const code = screen.getByTestId("code")
    expect(code).toBeInTheDocument()
    const testAddBtn = screen.getByTestId("testAdd")
    await waitFor(() => fireEvent.click(testAddBtn))
    expect(mockCallback).toHaveBeenCalledTimes(1)
  })
  test("saveCodeExternal", async () => {
    const mockCallback = jest.fn()
    const log = (eoa: Wallet) => eoa
    render(
      <Auth
        onEOAchange={log}
        label={"test"}
        language="ru"
        saveCodeExternal={[
          {
            label: "testSave",
            fn: mockCallback,
            icon: () => <div>testSave</div>,
          },
        ]}
        addCodeExternal={[]}
        test={{ loginSalt: null }}
      />
    )

    enterClick()
    const generateBtn = screen.getByTestId("generateWallet")
    await waitFor(() => fireEvent.click(generateBtn))
    const saveSaltBtn = screen.getByTestId("testSave")
    await waitFor(() => fireEvent.click(saveSaltBtn))
    expect(mockCallback).toHaveBeenCalledTimes(1)
  })
})
