/**
 * @type {import('prettier').Options}
 */
module.exports = {
  plugins: [require.resolve('prettier-plugin-astro')],

  singleQuote: true,
  trailingComma: 'es5',
  semi: false,
  overrides: [
    {
      files: '*.md',
      options: {
        singleQuote: false,
      },
    },
    {
      files: '**/*.astro',
      options: { parser: 'astro' },
    },
  ],
}
