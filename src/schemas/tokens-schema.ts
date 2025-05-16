import {
  number,
  string,
  type InferOutput,
  array,
  url,
  picklist,
  pipe,
  nonEmpty,
  strictObject,
  union,
  boolean,
  optional,
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
  image: DefaultListBasicTokenSchema.entries.image,
  imageNotFromUnderlying: optional(boolean()),
  mintUrl: pipe(string(), nonEmpty('Please enter a mintUrl'), url()),
  name: DefaultListBasicTokenSchema.entries.name,
  protocol: string(),
  symbol: DefaultListBasicTokenSchema.entries.symbol,
  type: picklist(['amm', 'cdp', 'perpetuals', 'unknown', 'vault']),
  underlyingTokens: array(AddressSchema),
})

export const DefaultListTokenSchema = union([
  DefaultListBasicTokenSchema,
  DefaultListTokenWithUnderlyingSchema,
])
export type DefaultListToken = InferOutput<typeof DefaultListTokenSchema>

export const DefaultListTokensSchema = array(DefaultListTokenSchema)
export type DefaultListTokens = InferOutput<typeof DefaultListTokensSchema>
