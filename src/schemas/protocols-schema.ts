import {
  array,
  type InferOutput,
  nonEmpty,
  optional,
  pipe,
  strictObject,
  string,
  url,
} from 'valibot'

export const DefaultListProtocolSchema = strictObject({
  description: string(),
  id: string(),
  imageDark: string(),
  imageLight: string(),
  imageOnTop: optional(string()),
  name: string(),
  prefix: optional(string()),
  type: string(),
  url: pipe(string(), nonEmpty('Please enter a url'), url()),
})
export type DefaultListProtocol = InferOutput<typeof DefaultListProtocolSchema>

export const DefaultListProtocolsSchema = array(DefaultListProtocolSchema)
export type DefaultListProtocols = InferOutput<
  typeof DefaultListProtocolsSchema
>
