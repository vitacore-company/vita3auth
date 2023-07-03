# Vita3auth

React component based on ethers.js library for easy authorization in web3 applications. Login requires mail, password and a unique guid for more security. Save the generated guid for your next login. After creating the wallet, the component gives the Wallet object.

## Installation

```shell-script
npm install @vitacore-company/vita3auth --save
```

## Usage

```jsx
import { Auth } from "@vitacore-company/vita3auth"
import "@vitacore-company/vita3auth/dist/index.css"

<Auth
  onEOAchange={setEOAwallet}
  label="Authorization"
  language="en"
  saveCodeExternal={[
    {
      label: "Console code",
      fn: (code) => console.log(code),
      icon: () => <div>Console</div>,
    },
  ]}
  addCodeExternal={[
    {
      label: "Add code external",
      fn: () => "cf0a4220-50c1-4539-89b4-9155195b5e9e",
      icon: () => <div>External</div>,
    },
  ]}
  providerURL="https://rpc.chiadochain.net"
/>
```

## Acknowledgements

- [ethers.js documentation](https://docs.ethers.org/v5/)

## Styles

add **@vitacore-company/vita3auth/dist/index.[css/scss]**

## API

#### Auth
| Parameter          | Type                       | Description                                          |
| :----------------- | :------------------------- | :--------------------------------------------------- |
| `onEOAchange`      | `(wallet: Wallet) => void` | **Required** Returns wallet object after generating |
| `label`            | `string`                   | **Required** Title of the login page                                         
| `saveCodeExternal` | `obj`                      | **Required** ISaveExternalMethod[]          |
| `addCodeExternal`  | `obj`                      | **Required**   IAddExternalMethod[]       |
| `providerURL?`     | `string`                   | **Blockchain provider** |
| `language?`        | `string`                   | **en,ru,ch,ar,sp,in,it,ge**                          |                                                    |


### Types

```jsx
interface IAddExternalMethod {
  label: string
  fn: () => string
  icon: () => JSX.Element
}
interface ISaveExternalMethod {
  label: string
  fn: (e: string) => void
  icon: () => JSX.Element
}

```
### Predefined localization
`sp` Spainish, `ge` Deutsch, `ru` Russian<br/>
`en` English, `ch` Chinese, `it` Italian<br/>
`in` Indian, `ar` Arabic<br/>


#### AddressEOA

```jsx
import { AddressEOA } from "@vitacore-company/vita3auth"
import "@vitacore-company/vita3auth/dist/index.css"


<AddressEOA address={EOAwallet.address} />

```



| Parameter         | Type     | Description |
| :---------------- | :------- | :---------- |
| `address?`        | `string` |             |
| `noAddressLabel?` | `string` |             |

## Authors

- [@vitacore-company](https://vitacore.ru/)

## 🔗 Links

[![github](https://img.shields.io/badge/github-000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/vitacore-company/vita3auth)
