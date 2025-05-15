import { writeFile } from 'node:fs/promises'

import type { ProtocolsInput } from '../../schema/protocols-schema'
import { formatDataToJson } from './format-data-to-json'

export const sortProtocols = async ({
  path,
  protocols,
}: {
  path: string
  protocols: ProtocolsInput
}) => {
  const sortedProtocols = protocols.sort((a, b) => a.id.localeCompare(b.id))

  await writeFile(
    path,
    formatDataToJson({ data: { protocols: sortedProtocols } }),
  )
}
