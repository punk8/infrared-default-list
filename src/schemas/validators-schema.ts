import { string, type InferOutput, array, strictObject } from 'valibot'

export const ValidatorInputSchema = strictObject({
  name: string(),
})
export type ValidatorInput = InferOutput<typeof ValidatorInputSchema>

export const ValidatorsInputSchema = array(ValidatorInputSchema)
export type ValidatorsInput = InferOutput<typeof ValidatorsInputSchema>
