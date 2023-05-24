# Mx.NET.SDK.SmartSend
⚡ MultiversX SmartSend TypeScript SDK: Library for interacting with Smart Send contracts on MultiversX blockchain

## How to install?
The content is delivered via npm package:
##### [@remarkabletools/mx-smartsend](https://www.npmjs.com/package/@remarkabletools/mx-smartsend)

## Main Features
- Create EGLD/Token/MetaESDT/NFT/SFT transactions for Smart Send contracts

## Quick start guide
### Basic example
```javascript
const provider = new ProxyNetworkProvider('https://devnet-gateway.multiversx.com')
const networkConfig = await provider.getNetworkConfig()

const myaddress = Address.fromBech32('MY_ADDRESS')
const accountOnNetwork = await provider.getAccount(myaddress)
const account = new Account(myaddress)
account.update(accountOnNetwork)

const smartSend = new SmartSend(account, networkConfig, 'MY_CONTRACT_BECH32_ADDRESS')

const inputTransactions = []
for (let i = 1; i < 10; i++) {
  inputTransactions.push(new TokenAmount('RECEIVER_ADDRESS', TokenTransfer.egldFromAmount('0.0' + i))) // TokenTransfer can also be fungibleFromAmount / metaEsdtFromAmount / nonFungible / semiFungible
}

try {
  const txs = smartSend.createEGLDTransactions(inputTransactions) // or createTokenTransactions / createMetaESDTTransactions / createNFTTransactions / createSFTTransactions
  // sign and send egldTxs
} catch (error) {
  console.log(error)
}
```

### Advanced example
*The following example is using a wallet __signer__ that should not be used in production, only in private!*
```javascript
const provider = new ProxyNetworkProvider('https://devnet-gateway.multiversx.com')
const networkConfig = await provider.getNetworkConfig()

const myaddress = Address.fromBech32('MY_ADDRESS')
const accountOnNetwork = await provider.getAccount(myaddress)
const account = new Account(myaddress)
account.update(accountOnNetwork)

const pemText = await promises.readFile('/path/wallet.pem', { encoding: 'utf8' })
const signer = UserSigner.fromPem(pemText)

const smartSend = new SmartSend(account, networkConfig, 'MY_CONTRACT_BECH32_ADDRESS')

const inputTransactions = []
for (let i = 1; i < 10; i++) {
  inputTransactions.push(new TokenAmount('RECEIVER_ADDRESS', TokenTransfer.fungibleFromAmount('TOKEN-123456', i, 18))) // TokenTransfer can also be fungibleFromAmount / metaEsdtFromAmount / nonFungible / semiFungible
}

try {
  const tokenTxs = smartSend.createTokenTransactions(inputTransactions)
  for (const tx of tokenTxs) {
    const serializedTransaction = tx.serializeForSigning()
    const transactionSignature = await signer.sign(serializedTransaction)
    tx.applySignature(transactionSignature)
  }

  const response = await provider.sendTransactions(tokenTxs)
  console.log(response)
} catch (error) {
  console.log(error)
}
```
