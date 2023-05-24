import BigNumber from 'bignumber.js'
import { TokenAmount } from './tokenAmount'

export function chunks (iterable: TokenAmount[], size: number): TokenAmount[][] {
  const res: TokenAmount[][] = []
  for (let i = 0; i < iterable.length; i += size) {
    const chunk = iterable.slice(i, i + size)
    res.push(chunk)
  }
  return res
}

export function sumAmounts (amounts: TokenAmount[]): BigNumber {
  let res = new BigNumber(0)
  amounts.forEach(amount => {
    res = BigNumber.sum(res, amount.amount.amountAsBigInteger)
  })

  return res
}
