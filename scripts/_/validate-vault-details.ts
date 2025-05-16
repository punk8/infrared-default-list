import slug from 'slug'
import { type Address, isAddressEqual, type PublicClient } from 'viem'

import type { Tokens } from '../../schema/tokens-schema'
import type { DefaultListVault } from '../../schema/vaults-schema'
import { validateBeraRewardsVault } from './validate-bera-rewards-vault'

slug.charmap['.'] = '.' // allow periods in urls. They are valid
slug.charmap['₮'] = '₮' // allow some unicode characters

const validateStakeTokenAndSlug = ({
  errors,
  slugs,
  tokens,
  vault,
}: {
  errors: Array<string>
  slugs: Array<string>
  tokens: Tokens
  vault: DefaultListVault
}) => {
  const stakeToken = tokens.find(({ address }) =>
    isAddressEqual(address as Address, vault.stakeTokenAddress as Address),
  )

  if (!stakeToken) {
    errors.push(
      `${vault.slug} does not have a token for ${vault.stakeTokenAddress}`,
    )
    return
  }

  if (!('protocol' in stakeToken)) {
    errors.push(
      `${stakeToken.name} does not have a protocol (vault validation)`,
    )
    return
  }

  let expectedSlug = ''
  if (stakeToken.name.startsWith(stakeToken.protocol)) {
    expectedSlug = stakeToken.name
  } else {
    expectedSlug = `${slug(stakeToken.protocol)}-${slug(stakeToken.name)}`
  }

  if (vault.slug !== expectedSlug) {
    if (slugs.includes(expectedSlug)) {
      if (!vault.slug.startsWith(expectedSlug)) {
        errors.push(`${vault.slug}’s slug does not start with ${expectedSlug}`)
      }
    } else {
      errors.push(`${vault.slug}’s slug does not match ${expectedSlug}`)
    }
  }

  if (slugs.includes(vault.slug)) {
    errors.push(
      `Duplicate slug found: ${vault.slug}. Vault slugs must be unique.`,
    )
  }
  slugs.push(vault.slug)
}

export const validateVaultDetails = async ({
  beraRewardsVaults,
  errors,
  publicClient,
  slugs,
  tokens,
  vault,
}: {
  beraRewardsVaults: Set<string>
  errors: Array<string>
  publicClient: PublicClient
  slugs: Array<string>
  tokens: Tokens
  vault: DefaultListVault
}) => {
  const lowerCasedBeraRewardsVaults = vault.beraRewardsVault.toLowerCase()
  if (beraRewardsVaults.has(lowerCasedBeraRewardsVaults)) {
    errors.push(
      `Duplicate beraRewardsVault found: ${vault.beraRewardsVault}. beraRewardsVaults must be unique.`,
    )
  }
  beraRewardsVaults.add(lowerCasedBeraRewardsVaults)
  validateStakeTokenAndSlug({ errors, slugs, tokens, vault })
  await validateBeraRewardsVault({
    errors,
    publicClient,
    vault,
  })
}
