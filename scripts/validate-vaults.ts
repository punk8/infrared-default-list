import { readdirSync } from 'node:fs'
import { parse } from 'valibot'
import { createPublicClient } from 'viem'

import { supportedChains } from '@/config/chains'
import { type Tokens, TokensSchema } from '@/schemas/tokens-schema'
import {
  type DefaultListVaults,
  DefaultListVaultsSchema,
} from '@/schemas/vaults-schema'

import { getJsonFile } from './_/get-json-file'
import { isValidChain } from './_/is-valid-chain'
import { outputScriptStatus } from './_/output-script-status'
import { transport } from './_/transport'
import { validateVaultDetails } from './_/validate-vault-details'

const folderPath = 'src/vaults'

const validateVaultsByChain = async ({
  chain,
}: {
  chain: keyof typeof supportedChains
}) => {
  const errors: Array<string> = []
  const vaultsFile: { vaults: DefaultListVaults } = getJsonFile({
    chain,
    path: `${folderPath}/${chain}.json`,
  })
  const vaults = parse(DefaultListVaultsSchema, vaultsFile.vaults)
  const tokensFile: { tokens: Tokens } = getJsonFile({
    chain,
    path: `src/tokens/${chain}.json`,
  })
  const tokens = parse(TokensSchema, tokensFile.tokens)

  const publicClient = createPublicClient({
    chain: supportedChains[chain],
    transport,
  })
  const slugs: Array<string> = []
  const beraRewardsVaults = new Set<string>()

  const promisedVaultDetails = vaults.map(
    async (vault) =>
      await validateVaultDetails({
        beraRewardsVaults,
        errors,
        publicClient,
        slugs,
        tokens,
        vault,
      }),
  )
  await Promise.all(promisedVaultDetails)
  outputScriptStatus({ chain, errors, type: 'Vaults' })
}

const validateVaults = async () => {
  const promises = readdirSync(folderPath).map(async (file) => {
    const chain = file.replace('.json', '')

    if (!isValidChain(chain)) {
      throw new Error(`Unsupported chain: ${chain}`)
    }
    await validateVaultsByChain({ chain })
  })

  await Promise.all(promises)
}

await validateVaults()
