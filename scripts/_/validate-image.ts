import { existsSync } from 'node:fs'
import path from 'path'

import { ASSETS_FOLDER } from './constants'

export const validateImage = async ({
  errors,
  folder,
  identifier,
  identifier2,
  image,
  required,
  type,
}: {
  errors: Array<string>
  folder: string
  identifier: string
  identifier2?: string
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
  const expectedFileName = identifier
    .toLowerCase()
    .replace(/\s|_|\/|\./g, '-')
    .replace('₮', 't')
  const expectedFileName2 = identifier2
    ? identifier2
        .toLowerCase()
        .replace(/\s|_|\/|\./g, '-')
        .replace('₮', 't')
    : undefined
  if (
    (type === 'Protocol' &&
      image !== `${expectedFileName}.svg` &&
      image !== `${expectedFileName}.webp` &&
      image !== `${expectedFileName}-dark.svg` &&
      image !== `${expectedFileName}-dark.webp` &&
      image !== `${expectedFileName}-light.svg` &&
      image !== `${expectedFileName}-light.webp`) ||
    (type === 'Token' &&
      image !== `${expectedFileName}.svg` &&
      image !== `${expectedFileName2}.svg`)
  ) {
    errors.push(
      `${type} image file "${image}" should use the name "${expectedFileName}.svg"${expectedFileName2 ? ` or "${expectedFileName2}.svg"` : ''}`,
    )
    return
  }
  const imagePath = path.join(`${ASSETS_FOLDER}/${folder}`, image)
  if (!existsSync(imagePath)) {
    errors.push(
      `${type} image file "${image}" not found for "${identifier}" at ${imagePath}`,
    )
  }
}
