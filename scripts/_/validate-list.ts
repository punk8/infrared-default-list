import addFormats from 'ajv-formats'
import Ajv from 'ajv/dist/2020'

import type { TokensSchema } from '@/types/tokens'
import type { VaultsSchema } from '@/types/vaults'

const ajv = new Ajv({ allErrors: true })
addFormats(ajv)

export const validateList = ({
  errors,
  list,
  schema,
  type,
}: {
  errors: Array<string>
  list: VaultsSchema | TokensSchema
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: any
  type: string
}) => {
  // Validate the overall structure
  const validate = ajv.compile(schema)
  const valid = validate(list)

  if (!valid) {
    validate.errors?.forEach((error) => {
      errors.push(`Error in ${type}: ${error.message} at ${error.instancePath}`)
    })
  }
}
