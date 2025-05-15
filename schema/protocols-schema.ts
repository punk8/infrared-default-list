import {
  string,
  type InferOutput,
  array,
  optional,
  strictObject,
} from 'valibot'

export const ProtocolInputSchema = strictObject({
  description: string(),
  id: string(),
  imageDark: string(),
  imageLight: string(),
  name: string(),
  prefix: optional(string()),
  url: string(),
})
export type ProtocolInput = InferOutput<typeof ProtocolInputSchema>

export const ProtocolsInputSchema = array(ProtocolInputSchema)
export type ProtocolsInput = InferOutput<typeof ProtocolsInputSchema>

export const ProtocolsSchema = strictObject({
  id: ProtocolInputSchema.entries.id,
  imageDark: ProtocolInputSchema.entries.imageDark,
  imageLight: ProtocolInputSchema.entries.imageLight,
  name: ProtocolInputSchema.entries.name,
  url: ProtocolInputSchema.entries.url,
})

export type Protocol = InferOutput<typeof ProtocolsSchema>
