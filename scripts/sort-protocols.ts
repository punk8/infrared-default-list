import { parse } from 'valibot'

import {
  type ProtocolsInput,
  ProtocolsInputSchema,
} from '../schema/protocols-schema'
import { getFile } from './_/get-file'
import { sortProtocols } from './_/sort-protocols'

const path = 'src/protocols.json'
const protocolsFile: { protocols: ProtocolsInput } = getFile(path)
const protocols = parse(ProtocolsInputSchema, protocolsFile.protocols)

const sortProtocolsScript = async () => {
  await sortProtocols({
    path,
    protocols,
  })
}

sortProtocolsScript()
