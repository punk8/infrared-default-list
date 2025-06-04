import type { DefaultListProtocol } from '@/schemas/protocols-schema'

import { IMAGE_SIZE } from './constants'
import { validateImage } from './validate-image'

export const validateProtocolImages = async ({
  errors,
  protocol,
}: {
  errors: Array<string>
  protocol: DefaultListProtocol
}) => {
  await validateImage({
    errors,
    folder: 'protocols',
    identifier: protocol.id,
    image: protocol.imageDark,
    required: true,
    type: 'Protocol',
    width: IMAGE_SIZE,
  })
  await validateImage({
    errors,
    folder: 'protocols',
    identifier: protocol.id,
    image: protocol.imageLight,
    required: true,
    type: 'Protocol',
    width: IMAGE_SIZE,
  })
}
