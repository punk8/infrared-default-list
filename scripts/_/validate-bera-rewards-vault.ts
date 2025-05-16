import { isAddressEqual, type Address, type PublicClient } from 'viem'

import type { DefaultListVault } from '../../schema/vaults-schema'
import { getRewardsVaultForStakeToken } from './get-rewards-vault-for-stake-token'

export const validateBeraRewardsVault = async ({
  errors,
  publicClient,
  vault,
}: {
  errors: Array<string>
  publicClient: PublicClient
  vault: DefaultListVault
}) => {
  const rewardsVaultAddress = await getRewardsVaultForStakeToken({
    publicClient,
    stakeTokenAddress: vault.stakeTokenAddress as Address,
  })

  if (!rewardsVaultAddress) {
    errors.push(
      `Could not fetch rewards vault address for ${vault.stakeTokenAddress}`,
    )
    return
  }

  if (!isAddressEqual(rewardsVaultAddress, vault.beraRewardsVault as Address)) {
    errors.push(
      `${vault.beraRewardsVault} does not match the on-chain rewards vault address for ${vault.stakeTokenAddress}. It should be ${rewardsVaultAddress}`,
    )
  }
}
