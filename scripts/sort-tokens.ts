import { readdirSync } from 'node:fs'
import { parse } from 'valibot'

import { type Tokens, TokensSchema } from '../schema/tokens-schema'
import { getJsonFile } from './_/get-json-file'
import { isValidChain } from './_/is-valid-chain'
import { sortTokens } from './_/sort-tokens'

const folderPath = 'src/tokens'

readdirSync(folderPath).forEach(async (file) => {
  const chain = file.replace('.json', '')

  if (!isValidChain(chain)) {
    throw new Error(`Unsupported chain: ${chain}`)
  }

  const path = `${folderPath}/${chain}.json`
  const tokensFile: { tokens: Tokens } = getJsonFile({
    chain,
    path,
  })
  const tokens = parse(TokensSchema, tokensFile.tokens)

  await sortTokens({
    path,
    tokens,
  })
})
