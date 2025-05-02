import { existsSync } from 'node:fs'
import path from 'path'

import { checkImageSize } from './check-image-size'
import { ASSETS_FOLDER } from './constants'

export const validateImage = async ({
  errors,
  folder,
  identifier,
  image,
  required,
  type,
}: {
  errors: Array<string>
  folder: string
  identifier: string
  image: string | undefined
  required: boolean
  type: string
}) => {
  if (!image) {
    if (required) {
      errors.push(`${type} image file "${image}" not found for "${identifier}"`)
    }
    return
  }
  const imagePath = path.join(`${ASSETS_FOLDER}/${folder}`, image)
  if (path.extname(imagePath).toLowerCase() === '.png') {
    errors.push(
      `${type} image file "${image}" for "${identifier}" should be a webp file, not a png`,
    )
  }
  if (!existsSync(imagePath)) {
    errors.push(
      `${type} image file "${image}" not found for "${identifier}" at ${imagePath}`,
    )
  }
  if (path.extname(imagePath).toLowerCase() === '.webp') {
    const isCorrectSize = await checkImageSize(imagePath)
    if (!isCorrectSize) {
      errors.push(
        `${type} image file "${image}" for "${identifier}" is not 128x128 pixels`,
      )
    }
    const pngImagePath = path.join(
      `${ASSETS_FOLDER}/${folder}/original`,
      image.replace('.webp', '.png'),
    )
    if (!existsSync(pngImagePath)) {
      errors.push(
        `${type} image file "${image}" for "${identifier}" does not have an original png file`,
      )
    }
  }
}
