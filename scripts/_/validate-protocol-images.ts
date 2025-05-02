import type { ProtocolsSchema } from '@/types/protocols'

import { validateImage } from './validate-image'

export const validateProtocolImages = async ({
  errors,
  protocol,
}: {
  errors: Array<string>
  protocol: ProtocolsSchema['protocols'][number]
}) => {
  await validateImage({
    errors,
    folder: 'protocols',
    identifier: protocol.id,
    image: protocol.imageDark,
    required: true,
    type: 'Protocol',
  })
  await validateImage({
    errors,
    folder: 'protocols',
    identifier: protocol.id,
    image: protocol.imageLight,
    required: true,
    type: 'Protocol',
  })
}
