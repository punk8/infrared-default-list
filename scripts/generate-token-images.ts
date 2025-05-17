import { SVG, registerWindow } from '@svgdotjs/svg.js'
import { readdirSync, readFileSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { createSVGWindow } from 'svgdom'
import { type Address, isAddressEqual } from 'viem'

import type { supportedChains } from '@/config/chains'
import type {
  DefaultListToken,
  DefaultListTokens,
} from '@/schemas/tokens-schema'

import { TOKENS_FOLDER } from './_/constants'
import { formatDataToJson } from './_/format-data-to-json'
import { getJsonFile } from './_/get-json-file'
import { isValidChain } from './_/is-valid-chain'

const folderPath = 'src/tokens'

const IMAGE_HEIGHT = 128
const IMAGE_WIDTH = 128
const GAP_BETWEEN = 64

const cleanFileName = (fileName: string) =>
  `${fileName.replace(/\s|_/g, '-').toLowerCase()}`

const generateTokenImage = async ({
  token,
  tokens,
}: {
  token: DefaultListToken
  tokens: DefaultListTokens
}) => {
  if ('underlyingTokens' in token && !token.imageNotFromUnderlying) {
    const window = createSVGWindow()
    const document = window.document
    registerWindow(window, document)

    const underLyingTokenImageFiles = token.underlyingTokens.map(
      (underlyingTokenAddress) => {
        const foundToken = tokens.find(({ address }) =>
          isAddressEqual(
            address.toLowerCase() as Address,
            underlyingTokenAddress.toLowerCase() as Address,
          ),
        )
        if (foundToken) {
          const imagePath = foundToken.image
          if (imagePath) {
            const imageFile = readFileSync(
              `${TOKENS_FOLDER}/${imagePath}`,
              'utf-8',
            )
            return imageFile.replaceAll('\n', '')
          }
          return undefined
        }
        return undefined
      },
    )
    if (underLyingTokenImageFiles) {
      // eslint-disable-next-line no-magic-numbers
      if (token.underlyingTokens.length === 2) {
        try {
          const combinedSVGs = SVG()
            // eslint-disable-next-line no-magic-numbers
            .size(IMAGE_WIDTH + GAP_BETWEEN * 2, IMAGE_HEIGHT)
            .add(SVG(underLyingTokenImageFiles[0]))
            .add(SVG(underLyingTokenImageFiles[1]).move(GAP_BETWEEN, 0))
            .svg()

          const fileName = cleanFileName(
            token.name.replace('.', '-').replace('₮', 't'),
          )
          await writeFile(`${TOKENS_FOLDER}/${fileName}.svg`, `${combinedSVGs}`)
          return `${fileName}.svg`
        } catch (error) {
          console.error(token.name, error)
        }
      }
    }
    // eslint-disable-next-line no-magic-numbers
    if (token.underlyingTokens.length === 3) {
      try {
        const combinedSVGs = SVG()
          // eslint-disable-next-line no-magic-numbers
          .size(IMAGE_WIDTH + GAP_BETWEEN * 3, IMAGE_HEIGHT)
          .add(SVG(underLyingTokenImageFiles[0]))
          .add(SVG(underLyingTokenImageFiles[1]).move(GAP_BETWEEN, 0))
          // eslint-disable-next-line no-magic-numbers
          .add(SVG(underLyingTokenImageFiles[2]).move(GAP_BETWEEN * 2, 0))
          .svg()

        const fileName = cleanFileName(
          token.name.replace('.', '-').replace('₮', 't'),
        )
        await writeFile(`${TOKENS_FOLDER}/${fileName}.svg`, `${combinedSVGs}`)
        return `${fileName}.svg`
      } catch (error) {
        console.error(token.name, error)
      }
    }
  }
  return null
}

const generateTokenImagesByChain = async ({
  chain,
}: {
  chain: keyof typeof supportedChains
}) => {
  const path = `${folderPath}/${chain}.json`
  const tokens: { tokens: DefaultListTokens } = getJsonFile({
    chain,
    path,
  })
  const promisedTokenImages = tokens.tokens.map(
    async (token) =>
      await generateTokenImage({
        token,
        tokens: tokens.tokens,
      }),
  )
  const promisedTokenImagesResult = await Promise.all(promisedTokenImages)
  const tokensToWrite = tokens.tokens.map((token, index) => {
    if (promisedTokenImagesResult[index]) {
      return {
        ...token,
        image: promisedTokenImagesResult[index],
      }
    }
    return token
  })
  await writeFile(path, formatDataToJson({ data: { tokens: tokensToWrite } }))
}

const generateTokenImages = async () => {
  const promises = readdirSync(folderPath).map(async (file) => {
    const chain = file.replace('.json', '')

    if (!isValidChain(chain)) {
      throw new Error(`Unsupported chain: ${chain}`)
    }
    await generateTokenImagesByChain({ chain })
  })

  await Promise.all(promises)
}

await generateTokenImages()
