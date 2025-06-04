import { readFileSync } from 'node:fs'

export const getFile = (fileName: string) => readFileSync(fileName, 'utf-8')
