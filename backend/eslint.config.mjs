import globals from 'globals'
import pluginJs from '@eslint/js'


export default [
  {
    ignores: ['**/dist']
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs'
    }
  },
  {
    languageOptions: {
      globals: globals.node
    }
  },
  pluginJs.configs.recommended,
  {
    rules: {
      'indent': ['error', 2],
      'linebreak-style': ['error', 'unix'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],
      'eqeqeq': ['error', 'always'],
      'object-curly-spacing': ['error', 'always']
    }
  }
]