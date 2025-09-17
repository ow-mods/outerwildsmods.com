const { defineConfig, globalIgnores } = require('eslint/config');

const tsParser = require('@typescript-eslint/parser');
const svelte = require('eslint-plugin-svelte');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const parser = require('svelte-eslint-parser');
const globals = require('globals');
const js = require('@eslint/js');

const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

module.exports = defineConfig([
	{
		languageOptions: {
			parser: tsParser,
			sourceType: 'module',
			ecmaVersion: 2020,
			parserOptions: {},

			globals: {
				...globals.browser,
				...globals.node,
			},
		},

		rules: {
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					varsIgnorePattern: '^_',
				},
			],
		},

		extends: compat.extends(
			'eslint:recommended',
			'plugin:@typescript-eslint/recommended',
			'prettier'
		),

		plugins: {
			svelte,
			'@typescript-eslint': typescriptEslint,
		},
	},
	globalIgnores(['**/*.cjs']),
	{
		files: ['**/*.svelte'],

		languageOptions: {
			parser: parser,

			parserOptions: {
				parser: '@typescript-eslint/parser',
			},
		},
	},
	globalIgnores([
		'**/.DS_Store',
		'**/node_modules',
		'build',
		'.svelte-kit',
		'package',
		'**/.env',
		'**/.env.*',
		'!**/.env.example',
		'**/pnpm-lock.yaml',
		'**/package-lock.json',
		'**/yarn.lock',
		'src/routes/history/+page.svelte', // old page, dont want to delete but dont want to fix.
		'**/*.d.ts', // wont usually write these ourselves.
	]),
]);
