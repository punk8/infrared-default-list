import { writeFile } from 'node:fs/promises'

import type { ValidatorsInput } from '@/schemas/validators-schema'

import { formatDataToJson } from './format-data-to-json'

export const sortValidators = async ({
  path,
  validators,
}: {
  path: string
  validators: ValidatorsInput
}) => {
  const sortedValidators = validators.sort((a, b) =>
    a.name.localeCompare(b.name),
  )

  await writeFile(
    path,
    formatDataToJson({ data: { validators: sortedValidators } }),
  )
}
