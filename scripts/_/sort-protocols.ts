import { writeFile } from 'node:fs/promises'

import type { DefaultListProtocols } from '@/schemas/protocols-schema'

import { formatDataToJson } from './format-data-to-json'

export const sortProtocols = async ({
  path,
  protocols,
}: {
  path: string
  protocols: DefaultListProtocols
}) => {
  const sortedProtocols = protocols.sort((a, b) => a.id.localeCompare(b.id))

  await writeFile(
    path,
    formatDataToJson({ data: { protocols: sortedProtocols } }),
  )
}
