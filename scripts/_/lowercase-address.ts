import { type Address, isAddressEqual } from 'viem'

import { BERA_TOKEN_ADDRESS } from './constants'

export const lowercaseAddress = (address: Address) => {
  if (isAddressEqual(address, BERA_TOKEN_ADDRESS)) {
    return BERA_TOKEN_ADDRESS
  }
  return address.toLowerCase() as Address
}
