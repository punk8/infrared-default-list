module.exports = {
  js2svg: {
    eol: 'lf',
    finalNewline: true,
  },
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          cleanupIds: {
            preservePrefixes: '_'
          },
        }
      }
    },
    'convertStyleToAttrs',
    'removeDimensions',
    'removeScripts',
    'removeTitle',
  ],
}
