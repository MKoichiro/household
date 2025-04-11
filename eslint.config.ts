import eslint from '@eslint/js'
import { Linter } from 'eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import tseslint, { ConfigArray } from 'typescript-eslint'
import tsParser from '@typescript-eslint/parser'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

// グローバル設定
const globalConfigs: Linter.Config[] = defineConfig([
  globalIgnores([
    'node_modules',
    'dist',
    'build',
    'personal',
    'src/assets',
    'public',
    'trash',
    '*.config.ts',
    '*.config.js',
  ]),
  {
    name: 'base',
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
])

// 素のeslintによる素のJavaScriptの設定
const vanillaConfigs: Linter.Config[] = defineConfig([
  eslint.configs.recommended,
  {
    name: 'eslint/recommended',
    files: ['src/**/*.js'],
    rules: {
      'no-console': 'warn',
      'no-shadow': 'warn',
    },
  },
])

// React
const reactConfigs: Linter.Config[] = defineConfig([
  // Recommended
  jsxA11y.flatConfigs.recommended,
  reactPlugin.configs.flat.recommended,
  reactHooks.configs['recommended-latest'],
  {
    // see: https://github.com/ArnaudBarre/eslint-plugin-react-refresh
    ...reactRefresh.configs.recommended,
    rules: {
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },

  // Custom
  {
    // v17以降は不要
    // see: https://ja.legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#eslint
    name: 'react/custom',
    rules: {
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
])

// TypeScript
const tsConfig: ConfigArray = tseslint.config(
  // Recommended
  // tseslint.configs.recommended より厳格な設定を適用
  // see: https://typescript-eslint.io/getting-started/typed-linting
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Custom
  {
    name: 'typescript-eslint/custom',
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      // アンダースコアで始まる変数・引数は未使用を許可
      // see: https://typescript-eslint.io/rules/no-unused-vars
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  }
)

// その他の設定
const commonConfigs: Linter.Config[] = defineConfig([
  // eslintのフォーマット関連のエラーを無視し、prettierのエラーをeslintのエラーとして表示する
  // see: https://github.com/prettier/eslint-plugin-prettier?tab=readme-ov-file#configuration-new-eslintconfigjs
  eslintPluginPrettierRecommended,
])

export default tseslint.config(globalConfigs, vanillaConfigs, reactConfigs, commonConfigs, tsConfig)
