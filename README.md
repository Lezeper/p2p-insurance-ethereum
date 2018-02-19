# P2P Insurance Concept Application
This concept application is trying to implement a P2P insurance product by using smart contract. The idea insurance product would be the product which has deterministic result in specific date. For example, travel or package delay insurance. Insured can propose a insurance(contract) that specific on when the airline/package should be arrived. After insured paid his premium(detemind by himself), the other people can contribute to this contract to match the premium untill the amount of all contributions are equal to the premium.

## Getting Start
On the end user side, it required the wallet plugin, for example, MetaMask.
```
> npm install
// compile contract and deploy to the blockchain
> node ethereum/deploy
// write down the address, put it as FACTORY_ADDRESS in environment file
// add .env on the root folder, add .env.js on ethereum folder
```
### Example of environment file
#### .env
```
WEB3_HTTP_PROVIDER=https://rinkeby.infura.io/XXXX
ADMIN_WALLET_ADDRESS=XXXX
ADMIN_WALLET_PRIVATE_KEY=XXXX
ADMIN_SEED_WORD=your seed word
FACTORY_ADDRESS=XXXX
CHAIN_ID=4
```
#### .env.js
```
export default {
  WEB3_HTTP_PROVIDER: 'https://rinkeby.infura.io/XXX',
  ADMIN_WALLET_ADDRESS: 'XXX',
  ADMIN_SEED_WORD: 'your seed word',
  FACTORY_ADDRESS: 'XXX',
}
```

