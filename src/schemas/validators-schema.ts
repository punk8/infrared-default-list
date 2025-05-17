import { string, type InferOutput, array, strictObject } from 'valibot'

export const DefaultListValidatorSchema = strictObject({
  name: string(),
})
export type DefaultListValidator = InferOutput<
  typeof DefaultListValidatorSchema
>

export const DefaultListValidatorsSchema = array(DefaultListValidatorSchema)
export type DefaultListValidators = InferOutput<
  typeof DefaultListValidatorsSchema
>
