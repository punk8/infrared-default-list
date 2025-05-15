import { readdirSync } from 'node:fs'
import { parse } from 'valibot'
import { createPublicClient } from 'viem'

import { supportedChains } from '@/config/chains'
import type { VaultsSchema } from '@/types/vaults'

import { type Tokens, TokensSchema } from '../schema/tokens-schema'
import { getFile } from './_/get-file'
import { getJsonFile } from './_/get-json-file'
import { isValidChain } from './_/is-valid-chain'
import { outputScriptStatus } from './_/output-script-status'
import { transport } from './_/transport'
import { validateList } from './_/validate-list'
import { validateVaultDetails } from './_/validate-vault-details'

const schema = getFile('schema/vaults-schema.json')
const folderPath = 'src/vaults'

const validateVaultsByChain = async ({
  chain,
}: {
  chain: keyof typeof supportedChains
}) => {
  const errors: Array<string> = []
  const path = `${folderPath}/${chain}.json`
  const vaults: VaultsSchema = getJsonFile({
    chain,
    path,
  })
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

  validateList({ errors, list: vaults, schema, type: 'vaults' })
  const promisedVaultDetails = vaults.vaults.map(
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
