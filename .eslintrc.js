module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
		es6: true,
	},
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier/@typescript-eslint"],
	parserOptions: {
		project: "./tsconfig.json",
	},
	rules: {
		"quotes": [2, "double"],
		"semi": [2, "always"],
		"no-undef": 0,
		"@typescript-eslint/camelcase": 0,
		"@typescript-eslint/class-name-casing": 0,
	},
	overrides: [
		{
			files: ["*.js"],
			rules: {
				"@typescript-eslint/no-var-requires": 0,
				"@typescript-eslint/explicit-function-return-type": 0,
			},
		},
	],
};
