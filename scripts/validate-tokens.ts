import { readdirSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { parse } from 'valibot'
import { createPublicClient } from 'viem'

import { supportedChains } from '@/config/chains'
import {
  type DefaultListTokens,
  DefaultListTokensSchema,
} from '@/schemas/tokens-schema'

import { cleanToken } from './_/clean-token'
import { formatDataToJson } from './_/format-data-to-json'
import { getJsonFile } from './_/get-json-file'
import { isValidChain } from './_/is-valid-chain'
import { outputScriptStatus } from './_/output-script-status'
import { transports } from './_/transports'
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
  const tokens = parse(DefaultListTokensSchema, tokensFile.tokens).map(
    (token) => cleanToken({ token }),
  )
  const publicClient = createPublicClient({
    batch: {
      multicall: true,
    },
    chain: supportedChains[chain],
    transport: transports[supportedChains[chain].id],
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

  await writeFile(
    path,
    formatDataToJson({
      data: { tokens },
    }),
  )
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
