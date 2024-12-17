// .eslintrc.js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 12,
    sourceType: 'module',
    requireConfigFile: false,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['vue', 'prettier'],
  rules: {
    // General ESLint rules
    'prettier/prettier': ['error', { tabWidth: 2, useTabs: false }],
    quotes: ['error', 'single'],
    'comma-dangle': ['error', 'only-multiline'],
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        // Disable the base indent rule for Vue files to prevent conflicts
        indent: 'off',
        // Enable vue/script-indent with 2-space indentation
        'vue/script-indent': [
          'error',
          2,
          {
            baseIndent: 1,
            switchCase: 1,
            ignores: [],
          },
        ],
      },
    },
  ],
};
