import { readdirSync } from 'node:fs'
import { parse } from 'valibot'

import {
  type ValidatorsInput,
  ValidatorsInputSchema,
} from '@/schemas/validators-schema'

import { getJsonFile } from './_/get-json-file'
import { isValidChain } from './_/is-valid-chain'
import { sortValidators } from './_/sort-validators'

const folderPath = 'src/validators'

readdirSync(folderPath).forEach(async (file) => {
  const chain = file.replace('.json', '')

  if (!isValidChain(chain)) {
    throw new Error(`Unsupported chain: ${chain}`)
  }

  const path = `${folderPath}/${chain}.json`
  const validatorsFile: { validators: ValidatorsInput } = getJsonFile({
    chain,
    path,
  })
  const validators = parse(ValidatorsInputSchema, validatorsFile.validators)

  await sortValidators({
    path,
    validators,
  })
})
