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

export const TokenSchema = union([
  strictObject({
    address: AddressSchema,
    decimals: number(),
    image: string(),
    name: string(),
    symbol: string(),
  }),
  strictObject({
    address: AddressSchema,
    decimals: number(),
    image: optional(string()),
    mintUrl: pipe(string(), nonEmpty('Please enter a mintUrl'), url()),
    name: string(),
    protocol: string(),
    symbol: string(),
    type: picklist(['amm', 'cdp', 'perpetuals', 'unknown', 'vault']),
    underlyingTokens: array(AddressSchema),
  }),
])
export type Token = InferOutput<typeof TokenSchema>

export const TokensSchema = array(TokenSchema)
export type Tokens = InferOutput<typeof TokensSchema>
