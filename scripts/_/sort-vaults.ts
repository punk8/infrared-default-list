import { writeFile } from 'node:fs/promises'

import type { Vaults } from '../../schema/vaults-schema'
import { formatDataToJson } from './format-data-to-json'

export const sortVaults = async ({
  path,
  vaults,
}: {
  path: string
  vaults: Vaults
}) => {
  const sortedVaults = vaults.sort((a, b) => a.slug.localeCompare(b.slug))

  await writeFile(path, formatDataToJson({ data: { vaults: sortedVaults } }))
}
