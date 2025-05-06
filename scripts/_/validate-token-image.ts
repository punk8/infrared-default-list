import type { TokensSchema } from '@/types/tokens'

import { validateImage } from './validate-image'

export const validateTokenImage = async ({
  errors,
  token,
}: {
  errors: Array<string>
  token: TokensSchema['tokens'][number]
}) => {
  const hasUnderlyingTokens = 'underlyingTokens' in token

  return validateImage({
    errors,
    folder: 'tokens',
    identifier: token.symbol,
    image: token.image,
    required:
      !hasUnderlyingTokens ||
      (hasUnderlyingTokens && token.underlyingTokens.length === 1),
    type: 'Token',
  })
}
