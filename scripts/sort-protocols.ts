import { parse } from 'valibot'

import {
  type DefaultListProtocols,
  DefaultListProtocolsSchema,
} from '@/schemas/protocols-schema'

import { getFile } from './_/get-file'
import { sortProtocols } from './_/sort-protocols'

const path = 'src/protocols.json'
const protocolsFile: { protocols: DefaultListProtocols } = getFile(path)
const protocols = parse(DefaultListProtocolsSchema, protocolsFile.protocols)

const sortProtocolsScript = async () => {
  await sortProtocols({
    path,
    protocols,
  })
}

sortProtocolsScript()
