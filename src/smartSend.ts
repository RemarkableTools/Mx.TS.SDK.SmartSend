import { SMART_SEND_METHOD, SMART_SEND_NFT_METHOD, SMART_SEND_SFT_METHOD } from './constants'
import { chunks, sumAmounts } from './helper'
import { TokenAmount } from './tokenAmount'

import { Account, Address, ContractFunction, INetworkConfig, SmartContract, TokenTransfer, Transaction, Interaction, TokenIdentifierValue, AddressValue, BigUIntValue, U64Value } from '@multiversx/sdk-core'

export class SmartSend {
  private readonly account: Account
  private readonly networkConfig: INetworkConfig
  private smartSendContract?: string
  private chunkLimit: number

  public constructor (
    account: Account,
    networkConfig: INetworkConfig,
    smartSendContract?: string,
    chunkLimit: number = 100
  ) {
    this.account = account
    this.networkConfig = networkConfig
    this.smartSendContract = smartSendContract
    this.chunkLimit = chunkLimit
  }

  public setChunkLimit (limit: number): void {
    this.chunkLimit = limit
  }

  public setSmartSendContractAddress (address: string): void {
    this.smartSendContract = address
  }

  public createEGLDTransactions (inputTransactions: TokenAmount[], gasPerTx: number = 600000, contractAddress?: string): Transaction[] {
    let smartSendContractAddress: Address
    if (contractAddress != null) {
      smartSendContractAddress = Address.fromBech32(contractAddress)
    } else {
      if (this.smartSendContract != null) { smartSendContractAddress = Address.fromBech32(this.smartSendContract) } else { throw new Error('Smart Send Contract address is not set') }
    }
    const contract = new SmartContract({ address: smartSendContractAddress })

    const transactionsChunks: TokenAmount[][] = chunks(inputTransactions, this.chunkLimit)
    const transactionRequests: Transaction[] = []
    transactionsChunks.forEach(chunk => {
      const gasLimit = chunk.length < 7 ? 40000000 : chunk.length * gasPerTx

      const args: any[] = []
      chunk.forEach(tx => {
        args.push(new AddressValue(tx.address))
        args.push(new BigUIntValue(tx.amount.amountAsBigInteger))
      })

      const amounts = sumAmounts(chunk)
      const amount = TokenTransfer.egldFromBigInteger(amounts)

      const interaction = new Interaction(contract, new ContractFunction(SMART_SEND_METHOD), args)
      const transactionRequest = interaction
        .withChainID(this.networkConfig.ChainID)
        .withSender(this.account.address)
        .withNonce(this.account.getNonceThenIncrement())
        .withGasLimit(gasLimit)
        .withValue(amount)
        .buildTransaction()
      transactionRequests.push(transactionRequest)
    })

    return transactionRequests
  }

  public createTokenTransactions (inputTransactions: TokenAmount[], gasPerTx: number = 900000, contractAddress?: string): Transaction[] {
    let smartSendContractAddress: Address
    if (contractAddress != null) {
      smartSendContractAddress = Address.fromBech32(contractAddress)
    } else {
      if (this.smartSendContract != null) { smartSendContractAddress = Address.fromBech32(this.smartSendContract) } else { throw new Error('Smart Send Contract address is not set') }
    }
    const contract = new SmartContract({ address: smartSendContractAddress })

    const tokenIdentifier = inputTransactions[0].amount.tokenIdentifier
    const numDecimals = inputTransactions[0].amount.numDecimals

    const transactionsChunks: TokenAmount[][] = chunks(inputTransactions, this.chunkLimit)
    const transactionRequests: Transaction[] = []
    transactionsChunks.forEach(chunk => {
      const gasLimit = chunk.length < 7 ? 60000000 : chunk.length * gasPerTx

      const args: any[] = []
      chunk.forEach(tx => {
        args.push(new AddressValue(tx.address))
        args.push(new BigUIntValue(tx.amount.amountAsBigInteger))
      })

      const amounts = sumAmounts(chunk)
      const amount = TokenTransfer.fungibleFromBigInteger(tokenIdentifier, amounts, numDecimals)

      const interaction = new Interaction(contract, new ContractFunction(SMART_SEND_METHOD), args)
      interaction.withSingleESDTTransfer(amount)
      const transactionRequest = interaction
        .withChainID(this.networkConfig.ChainID)
        .withSender(this.account.address)
        .withNonce(this.account.getNonceThenIncrement())
        .withGasLimit(gasLimit)
        .buildTransaction()
      transactionRequests.push(transactionRequest)
    })

    return transactionRequests
  }

  public createMetaESDTTransactions (inputTransactions: TokenAmount[], gasPerTx: number = 900000, contractAddress?: string): Transaction[] {
    let smartSendContractAddress: Address
    if (contractAddress != null) {
      smartSendContractAddress = Address.fromBech32(contractAddress)
    } else {
      if (this.smartSendContract != null) { smartSendContractAddress = Address.fromBech32(this.smartSendContract) } else { throw new Error('Smart Send Contract address is not set') }
    }
    const contract = new SmartContract({ address: smartSendContractAddress })

    const tokenIdentifier = inputTransactions[0].amount.tokenIdentifier
    const nonce = inputTransactions[0].amount.nonce
    const numDecimals = inputTransactions[0].amount.numDecimals

    const transactionsChunks: TokenAmount[][] = chunks(inputTransactions, this.chunkLimit)
    const transactionRequests: Transaction[] = []
    transactionsChunks.forEach(chunk => {
      const gasLimit = chunk.length < 7 ? 60000000 : chunk.length * gasPerTx

      const args: any[] = []
      chunk.forEach(tx => {
        args.push(new AddressValue(tx.address))
        args.push(new BigUIntValue(tx.amount.amountAsBigInteger))
      })

      const amounts = sumAmounts(chunk)
      const amount = TokenTransfer.metaEsdtFromBigInteger(tokenIdentifier, nonce, amounts, numDecimals)

      const interaction = new Interaction(contract, new ContractFunction(SMART_SEND_METHOD), args)
      interaction.withSingleESDTNFTTransfer(amount)
      const transactionRequest = interaction
        .withChainID(this.networkConfig.ChainID)
        .withSender(this.account.address)
        .withNonce(this.account.getNonceThenIncrement())
        .withGasLimit(gasLimit)
        .buildTransaction()
      transactionRequests.push(transactionRequest)
    })

    return transactionRequests
  }

  public createNFTTransactions (inputTransactions: TokenAmount[], gasPerTx: number = 900000, contractAddress?: string): Transaction[] {
    let smartSendContractAddress: Address
    if (contractAddress != null) {
      smartSendContractAddress = Address.fromBech32(contractAddress)
    } else {
      if (this.smartSendContract != null) { smartSendContractAddress = Address.fromBech32(this.smartSendContract) } else { throw new Error('Smart Send Contract address is not set') }
    }
    const contract = new SmartContract({ address: smartSendContractAddress })

    const transactionsChunks: TokenAmount[][] = chunks(inputTransactions, this.chunkLimit)
    const transactionRequests: Transaction[] = []
    transactionsChunks.forEach(chunk => {
      const gasLimit = chunk.length < 7 ? 60000000 : chunk.length * gasPerTx

      const nfts: any[] = []
      const args: any[] = []
      chunk.forEach(tx => {
        nfts.push(TokenTransfer.nonFungible(tx.amount.tokenIdentifier, tx.amount.nonce))

        args.push(new AddressValue(tx.address))
        args.push(new TokenIdentifierValue(tx.amount.tokenIdentifier))
        args.push(new U64Value(tx.amount.nonce))
      })

      const interaction = new Interaction(contract, new ContractFunction(SMART_SEND_NFT_METHOD), args)
      interaction.withMultiESDTNFTTransfer(nfts)
      const transactionRequest = interaction
        .withChainID(this.networkConfig.ChainID)
        .withSender(this.account.address)
        .withNonce(this.account.getNonceThenIncrement())
        .withGasLimit(gasLimit)
        .buildTransaction()
      transactionRequests.push(transactionRequest)
    })

    return transactionRequests
  }

  public createSFTTransactions (inputTransactions: TokenAmount[], gasPerTx: number = 900000, contractAddress?: string): Transaction[] {
    let smartSendContractAddress: Address
    if (contractAddress != null) {
      smartSendContractAddress = Address.fromBech32(contractAddress)
    } else {
      if (this.smartSendContract != null) { smartSendContractAddress = Address.fromBech32(this.smartSendContract) } else { throw new Error('Smart Send Contract address is not set') }
    }
    const contract = new SmartContract({ address: smartSendContractAddress })

    const tokenIdentifier = inputTransactions[0].amount.tokenIdentifier
    const nonce = inputTransactions[0].amount.nonce

    const transactionsChunks: TokenAmount[][] = chunks(inputTransactions, this.chunkLimit)
    const transactionRequests: Transaction[] = []
    transactionsChunks.forEach(chunk => {
      const gasLimit = chunk.length < 7 ? 60000000 : chunk.length * gasPerTx

      const args: any[] = []
      chunk.forEach(tx => {
        args.push(new AddressValue(tx.address))
        args.push(new BigUIntValue(tx.amount.amountAsBigInteger))
      })

      const amounts = sumAmounts(chunk)
      const amount = TokenTransfer.semiFungible(tokenIdentifier, nonce, amounts.toNumber())

      const interaction = new Interaction(contract, new ContractFunction(SMART_SEND_SFT_METHOD), args)
      interaction.withSingleESDTNFTTransfer(amount)
      const transactionRequest = interaction
        .withChainID(this.networkConfig.ChainID)
        .withSender(this.account.address)
        .withNonce(this.account.getNonceThenIncrement())
        .withGasLimit(gasLimit)
        .buildTransaction()
      transactionRequests.push(transactionRequest)
    })

    return transactionRequests
  }
}
