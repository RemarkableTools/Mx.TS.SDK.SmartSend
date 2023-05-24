import { Address, TokenTransfer } from '@multiversx/sdk-core'

export class TokenAmount {
  address: Address
  amount: TokenTransfer

  constructor (address: string, amount: TokenTransfer) {
    this.address = Address.fromBech32(address)
    this.amount = amount
  }
}
