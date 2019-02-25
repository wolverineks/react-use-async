// @flow

module.exports = {
  extends: ['standard', 'plugin:flowtype/recommended', 'plugin:import/recommended', 'plugin:promise/recommended'],
  plugins: ['import', 'flowtype', 'standard', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'flowtype/require-valid-file-annotation': [2, 'always'],
    'flowtype/semi': [2, 'never'],
    'flowtype/newline-after-flow-annotation': [2, 'always'],
    'flowtype/sort-keys': [
      2,
      'asc',
      {
        caseSensitive: true,
        natural: false
      }
    ],
    'flowtype/no-dupe-keys': 2,
    'flowtype/require-exact-type': [2, 'always'],
    'no-throw-literal': 'error',
    'no-var': 'error',
    'prefer-const': 'error'
  }
}
