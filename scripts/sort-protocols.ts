import { parse } from 'valibot'

import {
  type DefaultListProtocols,
  DefaultListProtocolsSchema,
} from '@/schemas/protocols-schema'

import { getJsonFile } from './_/get-json-file'
import { sortProtocols } from './_/sort-protocols'

const path = 'src/protocols.json'
const protocolsFile: { protocols: DefaultListProtocols } = getJsonFile({ path })
const protocols = parse(DefaultListProtocolsSchema, protocolsFile.protocols)

const sortProtocolsScript = async () => {
  await sortProtocols({
    path,
    protocols,
  })
}

sortProtocolsScript()
