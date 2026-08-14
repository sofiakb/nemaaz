import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier/recommended';

// ESLint 10 dropped .eslintrc entirely, so this is the flat config replacement.
export default tseslint.config(
	{
		ignores: ['lib/**', 'node_modules/**', 'coverage/**'],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: {
				...globals.node,
			},
		},
		rules: {
			'@typescript-eslint/ban-ts-comment': 'off',
		},
	},
	// Keep prettier last: it turns formatting differences into ESLint errors and switches
	// off every stylistic rule the configs above would otherwise fight it over.
	prettier,
);
