import type { TokensSchema } from '@/types/tokens'

import { validateImage } from './validate-image'

export const validateTokenImage = async ({
  errors,
  required,
  token,
}: {
  errors: Array<string>
  required: boolean
  token: TokensSchema['tokens'][number]
}) =>
  validateImage({
    errors,
    folder: 'tokens',
    identifier: token.symbol,
    image: token.image,
    required,
    type: 'Token',
  })
