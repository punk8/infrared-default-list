import { fallback, http } from 'viem'

export const transport = fallback([
  http(
    `https://greatest-shy-wildflower.bera-mainnet.quiknode.pro/${process.env.QUICKNODE_TOKEN}`,
  ),
  http(),
])
