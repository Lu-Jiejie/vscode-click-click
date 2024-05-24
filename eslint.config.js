// @ts-check
const antfu = require('@antfu/eslint-config').default

module.exports = antfu(
  {
    ignores: [
      // eslint ignore globs here
      'README.md',
    ],
  },
  {
    rules: {
      // overrides
    },
  },
)
