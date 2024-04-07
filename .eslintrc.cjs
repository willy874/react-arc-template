module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'prettier',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended'
  ],
  ignorePatterns: ['dist', 'public', '.eslintrc.cjs', 'prettier.config.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['prettier', 'react-refresh'],
  rules: {
    '@typescript-eslint/no-explicit-any': ['off'],
    'prettier/prettier': ['error', require('./prettier.config.cjs')],
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }]
  }
};
