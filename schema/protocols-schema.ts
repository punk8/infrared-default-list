import { object, string, type InferOutput, array, optional } from 'valibot'

export const ProtocolInputSchema = object({
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

export const ProtocolsSchema = object({
  id: ProtocolInputSchema.entries.id,
  imageDark: ProtocolInputSchema.entries.imageDark,
  imageLight: ProtocolInputSchema.entries.imageLight,
  name: ProtocolInputSchema.entries.name,
  url: ProtocolInputSchema.entries.url,
})

export type Protocol = InferOutput<typeof ProtocolsSchema>
