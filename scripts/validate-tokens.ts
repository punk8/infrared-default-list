import { readdirSync } from 'node:fs'
import { parse } from 'valibot'
import { createPublicClient } from 'viem'

import { supportedChains } from '@/config/chains'
import {
  type DefaultListTokens,
  DefaultListTokensSchema,
} from '@/schemas/tokens-schema'

import { getJsonFile } from './_/get-json-file'
import { isValidChain } from './_/is-valid-chain'
import { outputScriptStatus } from './_/output-script-status'
import { transport } from './_/transport'
import { validateTokenDetails } from './_/validate-token-details'

const folderPath = 'src/tokens'

const validateTokensByChain = async ({
  chain,
}: {
  chain: keyof typeof supportedChains
}) => {
  const errors: Array<string> = []
  const path = `${folderPath}/${chain}.json`
  const tokensFile: { tokens: DefaultListTokens } = getJsonFile({
    chain,
    path,
  })
  const tokens = parse(DefaultListTokensSchema, tokensFile.tokens)
  const publicClient = createPublicClient({
    chain: supportedChains[chain],
    transport,
  })
  const addresses = new Set<string>()

  const promisedVaultDetails = tokens.map(
    async (token) =>
      await validateTokenDetails({
        addresses,
        errors,
        publicClient,
        token,
        tokens,
      }),
  )
  await Promise.all(promisedVaultDetails)

  outputScriptStatus({ chain, errors, type: 'Token' })
}

const validateTokens = async () => {
  const promises = readdirSync(folderPath).map(async (file) => {
    const chain = file.replace('.json', '')

    if (!isValidChain(chain)) {
      throw new Error(`Unsupported chain: ${chain}`)
    }
    await validateTokensByChain({ chain })
  })

  await Promise.all(promises)
}

await validateTokens()
