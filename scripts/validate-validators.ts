import { readdirSync } from 'node:fs'
import { parse } from 'valibot'

import type { supportedChains } from '@/config/chains'

import {
  type ValidatorsInput,
  ValidatorsInputSchema,
} from '../schema/validators-schema'
import { getJsonFile } from './_/get-json-file'
import { isValidChain } from './_/is-valid-chain'
import { outputScriptStatus } from './_/output-script-status'

const folderPath = 'src/validators'

const validateValidatorsByChain = async ({
  chain,
}: {
  chain: keyof typeof supportedChains
}) => {
  const errors: Array<string> = []
  const path = `${folderPath}/${chain}.json`
  const validatorsFile: { validators: ValidatorsInput } = getJsonFile({
    chain,
    path,
  })
  parse(ValidatorsInputSchema, validatorsFile.validators)
  outputScriptStatus({ chain, errors, type: 'Validator' })
}

const validateValidators = async () => {
  const promises = readdirSync(folderPath).map(async (file) => {
    const chain = file.replace('.json', '')

    if (!isValidChain(chain)) {
      throw new Error(`Unsupported chain: ${chain}`)
    }

    await validateValidatorsByChain({ chain })
  })

  await Promise.all(promises)
}

await validateValidators()
