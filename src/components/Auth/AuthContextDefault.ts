export const AuthContextDefault = {
  setMessage: () => undefined,
  setModalShow: () => undefined,
  setLoginSalt: () => undefined,
  generateWallet: () => new Promise(() => ""),
  loginSalt: null,
  email: "",
  setEmail: () => undefined,
  password: "",
  setPassword: () => undefined,
  saveCodeMethods: [],
  addCodeMethods: [],
}
