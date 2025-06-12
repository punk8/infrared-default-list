import type { DefaultListProtocol } from '@/schemas/protocols-schema'

import { checkUniqueness } from './check-uniqueness'
import { validateProtocolImages } from './validate-protocol-images'

export const validateProtocolDetails = async ({
  errors,
  protocol,
  protocolIds,
}: {
  errors: Array<string>
  protocol: DefaultListProtocol
  protocolIds: Set<string>
}) => {
  checkUniqueness({
    errors,
    fieldName: 'id',
    set: protocolIds,
    value: protocol.id,
  })

  await validateProtocolImages({
    errors,
    protocol,
  })
}
