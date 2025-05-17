import { parse } from 'valibot'

import {
  type DefaultListProtocols,
  DefaultListProtocolsSchema,
} from '@/schemas/protocols-schema'

import { getFile } from './_/get-file'
import { outputScriptStatus } from './_/output-script-status'
import { validateProtocolImages } from './_/validate-protocol-images'

const path = 'src/protocols.json'
const protocolsFile: { protocols: DefaultListProtocols } = getFile(path)

const validateProtocols = async () => {
  const errors: Array<string> = []
  const protocolIds = new Set<string>()

  const protocols = parse(DefaultListProtocolsSchema, protocolsFile.protocols)
  const promisedProtocolDetails = protocols.map(async (protocol) => {
    if (protocolIds.has(protocol.id)) {
      errors.push(
        `Duplicate protocol found: ${protocol.id}. Protocol ids must be unique.`,
      )
    }
    protocolIds.add(protocol.id)

    return await validateProtocolImages({
      errors,
      protocol,
    })
  })
  await Promise.all(promisedProtocolDetails)
  outputScriptStatus({ errors, type: 'Protocols' })
}

await validateProtocols()
