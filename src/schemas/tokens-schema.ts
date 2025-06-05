import {
  array,
  boolean,
  nonEmpty,
  number,
  optional,
  picklist,
  pipe,
  strictObject,
  string,
  type InferOutput,
  union,
  url,
} from 'valibot'

import { AddressSchema } from './address-schema'

export const MintUrlSchema = pipe(
  string(),
  nonEmpty('Please enter a mintUrl'),
  url(),
)
export const ProtocolSchema = string()
export const TokenTypeSchema = picklist([
  'amm',
  'cdp',
  'perpetuals',
  'points',
  'unknown',
  'vault',
])

export const DefaultListBasicTokenSchema = strictObject({
  address: AddressSchema,
  decimals: number(),
  image: string(),
  isSoulbound: optional(boolean()),
  isUnpriced: optional(boolean()),
  name: string(),
  symbol: string(),
})
export type DefaultListBasicToken = InferOutput<
  typeof DefaultListBasicTokenSchema
>
export const DefaultListAdvancedTokenSchema = strictObject({
  ...DefaultListBasicTokenSchema.entries,
  mintUrl: MintUrlSchema,
  protocol: ProtocolSchema,
  type: TokenTypeSchema,
})
export type DefaultListAdvancedToken = InferOutput<
  typeof DefaultListAdvancedTokenSchema
>
export const DefaultListAdvancedTokenWithUnderlyingSchema = strictObject({
  ...DefaultListAdvancedTokenSchema.entries,
  imageNotFromUnderlying: optional(boolean()),
  underlyingTokens: array(AddressSchema),
})
export type DefaultListAdvancedTokenWithUnderlying = InferOutput<
  typeof DefaultListAdvancedTokenWithUnderlyingSchema
>

export const DefaultListTokenSchema = union([
  DefaultListBasicTokenSchema,
  DefaultListAdvancedTokenSchema,
  DefaultListAdvancedTokenWithUnderlyingSchema,
])
export type DefaultListToken = InferOutput<typeof DefaultListTokenSchema>

export const DefaultListTokensSchema = array(DefaultListTokenSchema)
export type DefaultListTokens = InferOutput<typeof DefaultListTokensSchema>
