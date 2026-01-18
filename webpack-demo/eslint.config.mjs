import js from '@eslint/js'
import globals from 'globals';
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import importPlugin from 'eslint-plugin-import'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
    // 1️⃣ 忽略文件
    {
        ignores: ['dist', 'build', 'public', 'node_modules'],
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            globals: globals.node,
        },
    },
    // 2️⃣ JS / JSX
    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: globals.browser,
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
            import: importPlugin,
        },
        rules: {
            ...js.configs.recommended.rules,
            // React
            'react/jsx-uses-react': 'off', // React 17+
            'react/react-in-jsx-scope': 'off',
            // Hooks
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            // Import
            'import/order': [
                'warn',
                {
                    groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
                    'newlines-between': 'always',
                },
            ],
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    // 3️⃣ TS / TSX
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                project: './tsconfig.json',
            },
            globals: globals.browser,
        },
        plugins: {
            '@typescript-eslint': tseslint,
            react,
            'react-hooks': reactHooks,
            import: importPlugin,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tseslint.configs.recommended.rules,
            // TS 常用规则
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_' },
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
            // React
            'react/react-in-jsx-scope': 'off',
            // Hooks
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
        },
        settings: {
            react: {
                version: 'detect',
            },
            'import/resolver': {
                typescript: {
                    project: './tsconfig.json',
                },
            },
        },
    },
    eslintConfigPrettier
]
