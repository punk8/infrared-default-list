import { object, string, type InferOutput, array } from 'valibot'

export const ValidatorInputSchema = object({
  name: string(),
})
export type ValidatorInput = InferOutput<typeof ValidatorInputSchema>

export const ValidatorsInputSchema = array(ValidatorInputSchema)
export type ValidatorsInput = InferOutput<typeof ValidatorsInputSchema>
