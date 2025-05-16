import { writeFile } from 'node:fs/promises'

import type { DefaultListVaults } from '@/schemas/vaults-schema'

import { formatDataToJson } from './format-data-to-json'

export const sortVaults = async ({
  path,
  vaults,
}: {
  path: string
  vaults: DefaultListVaults
}) => {
  const sortedVaults = vaults.sort((a, b) => a.slug.localeCompare(b.slug))

  await writeFile(path, formatDataToJson({ data: { vaults: sortedVaults } }))
}
