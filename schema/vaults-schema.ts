import { string, type InferOutput, array, strictObject } from 'valibot'

import { AddressSchema } from './address-schema'

export const VaultSchema = strictObject({
  beraRewardsVault: AddressSchema,
  slug: string(),
  stakeTokenAddress: AddressSchema,
})
export type Vault = InferOutput<typeof VaultSchema>

export const VaultsSchema = array(VaultSchema)
export type Vaults = InferOutput<typeof VaultsSchema>
