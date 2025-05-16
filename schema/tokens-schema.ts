import {
  number,
  optional,
  string,
  type InferOutput,
  array,
  url,
  picklist,
  pipe,
  nonEmpty,
  strictObject,
  union,
} from 'valibot'

import { AddressSchema } from './address-schema'

export const DefaultListBasicTokenSchema = strictObject({
  address: AddressSchema,
  decimals: number(),
  image: string(),
  name: string(),
  symbol: string(),
})
export const DefaultListTokenWithUnderlyingSchema = strictObject({
  address: DefaultListBasicTokenSchema.entries.address,
  decimals: DefaultListBasicTokenSchema.entries.decimals,
  image: optional(DefaultListBasicTokenSchema.entries.image),
  mintUrl: pipe(string(), nonEmpty('Please enter a mintUrl'), url()),
  name: DefaultListBasicTokenSchema.entries.name,
  protocol: string(),
  symbol: DefaultListBasicTokenSchema.entries.symbol,
  type: picklist(['amm', 'cdp', 'perpetuals', 'unknown', 'vault']),
  underlyingTokens: array(AddressSchema),
})

export const TokenSchema = union([
  DefaultListBasicTokenSchema,
  DefaultListTokenWithUnderlyingSchema,
])
export type Token = InferOutput<typeof TokenSchema>

export const TokensSchema = array(TokenSchema)
export type Tokens = InferOutput<typeof TokensSchema>
