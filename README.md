# Vita3auth

React component based on ethers.js library for easy authorization in web3 applications. Login requires mail, password and a unique guid for more security. Save the generated guid for your next login. After creating the wallet, the component gives the Wallet object.

## Acknowledgements

- [ethers.js documentation](https://docs.ethers.org/v5/)

## API

#### Auth

| Parameter          | Type                       | Description                                          |
| :----------------- | :------------------------- | :--------------------------------------------------- |
| `onEOAchange`      | `(wallet: Wallet) => void` | **Required**. Returns wallet object after generating |
| `label`            | `string`                   | **Required**                                         |
| `language?`        | `string`                   | **en,ru,ch,ar,sp,in,it,ge**                          |
| `saveCodeExternal` | `obj`                      | **Required**. Check type inside the project          |
| `addCodeExternal`  | `obj`                      | **Required**. Check type inside the project          |
| `providerURL?`     | `string`                   |                                                      |

#### AddressEOA

| Parameter         | Type     | Description |
| :---------------- | :------- | :---------- |
| `address?`        | `string` |             |
| `noAddressLabel?` | `string` |             |

## Authors

- [@vitacore-company](https://vitacore.ru/)

## 🔗 Links

[![github](https://img.shields.io/badge/github-000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/vitacore-company/vita3auth)
