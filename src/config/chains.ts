import { berachain, berachainBepolia } from 'viem/chains'

export const supportedChains = {
  bepolia: berachainBepolia,
  mainnet: berachain,
} as const
