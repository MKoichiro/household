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
import importPlugin from 'eslint-plugin-import' // 公式で型定義は未公開らしい、eslintのruntimeで影響があるものでは無いので無視

// グローバル設定
const globalConfigs: Linter.Config[] = defineConfig([
  globalIgnores([
    'node_modules',
    'dist',
    'build',
    'personal',
    'src/assets',
    'docs',
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
        tsconfigRootDir: import.meta.dirname,
        project: ['./tsconfig.app.json'],
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          project: ['./tsconfig.app.json'],
        },
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
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports', // 型のみなら import type を使う
          disallowTypeAnnotations: false, // 型注釈内での import type は許可
        },
      ],
    },
  }
)

// その他の設定
const commonConfigs: Linter.Config[] = defineConfig([
  // eslint のフォーマット関連のエラーを無視し、prettier のエラーを eslint のエラーとして表示
  // see: https://github.com/prettier/eslint-plugin-prettier?tab=readme-ov-file#configuration-new-eslintconfigjs
  eslintPluginPrettierRecommended,

  // import での path alias 強制
  {
    name: 'alias/enforce',
    plugins: { import: importPlugin },
    rules: {
      // 以下二行で、親ディレクトリからの相対パスインポートを禁止し、@* は許可
      // 'import/no-relative-parent-imports': ['error', { ignores: ['@*'] }] と動作的に等価だが、一般的ではないようなので不採用とした
      'import/no-relative-parent-imports': 'off',
      'no-restricted-imports': [
        'error',
        {
          patterns: ['../*'],
        },
      ],
    },
  },

  // import の順序を制御
  {
    name: 'import/order',
    plugins: { import: importPlugin },
    rules: {
      'import/order': [
        'error',
        {
          // 記述順がルールとして適用される
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'], // 相対パスは細分化
          ],
          'newlines-between': 'always', // グループ間改行
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
  {
    name: 'no-useless-index',
    plugins: { import: importPlugin },
    rules: {
      // index.(js|ts|tsx) の末尾指定を禁止し、自動解決に任せる
      'import/no-useless-path-segments': ['error', { noUselessIndex: true }],
    },
  },
])

export default tseslint.config(globalConfigs, vanillaConfigs, reactConfigs, commonConfigs, tsConfig)
