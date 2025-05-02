import { existsSync } from 'node:fs'
import path from 'path'

import type { TokensSchema } from '@/types/tokens'

import { checkImageSize } from './check-image-size'
import { ASSETS_FOLDER } from './constants'

export const validateTokenImage = async ({
  errors,
  required,
  token,
}: {
  errors: Array<string>
  required: boolean
  token: TokensSchema['tokens'][number]
}) => {
  if (!token.image) {
    if (required) {
      errors.push(
        `Token image file "${token.image}" not found for "${token.symbol}"`,
      )
    }
    return
  }
  const imagePath = path.join(`${ASSETS_FOLDER}/tokens`, token.image)
  if (path.extname(imagePath).toLowerCase() === '.png') {
    errors.push(
      `Token image file "${token.image}" for "${token.symbol}" should be a webp file, not a png`,
    )
  }
  if (!existsSync(imagePath)) {
    errors.push(
      `Token image file "${token.image}" not found for "${token.symbol}" at ${imagePath}`,
    )
  }
  if (path.extname(imagePath).toLowerCase() === '.webp') {
    const isCorrectSize = await checkImageSize(imagePath)
    if (!isCorrectSize) {
      errors.push(
        `Token image file "${token.image}" for "${token.symbol}" is not 128x128 pixels`,
      )
    }
    const pngImagePath = path.join(
      `${ASSETS_FOLDER}/tokens/original`,
      token.image.replace('.webp', '.png'),
    )
    if (!existsSync(pngImagePath)) {
      errors.push(
        `Token image file "${token.image}" for "${token.symbol}" does not have an original png file`,
      )
    }
  }
}
