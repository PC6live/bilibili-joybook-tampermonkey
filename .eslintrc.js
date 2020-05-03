module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
		es6: true,
	},
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
	],
	parserOptions: {
		project: 'tsconfig.json',
	},
	rules: {
		'@typescript-eslint/camelcase': 0,
		'@typescript-eslint/class-name-casing': 0,
	},
	overrides: [
		{
			files: ['*.js'],
			rules: {
				'@typescript-eslint/no-var-requires': 0,
				'@typescript-eslint/explicit-function-return-type': 0,
			},
		},
	],
};
