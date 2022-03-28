module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		sourceType: 'module',
	},
	plugins: [
		'@typescript-eslint/eslint-plugin',
		'prettier',
		'@typescript-eslint',
	],
	extends: [
		'airbnb-base',
		'airbnb-typescript/base',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
	],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: ['.eslintrc.js'],
	rules: {
        "max-classes-per-file":"off",
		'no-console': 'warn',
		'no-var': 'error',
		'no-unused-vars': 'error',
		'no-useless-computed-key': 'error',
		'no-undefined': 'warn',
		'no-promise-executor-return': 'warn',
		'no-empty-function': 'error',
		'no-implicit-coercion': 'error',
		'no-new-wrappers': 'error',
		'no-useless-return': 'error',
		'no-eq-null': 'error',
		'no-plusplus': 'warn',
		'no-nested-ternary': 'warn',
		'no-unsafe-optional-chaining': 'warn',
		'no-alert': 'error',
		'no-trailing-spaces': 'error',
		'no-spaced-func': 'error',
		'no-unneeded-ternary': 'error',
		'no-else-return': ['error', { allowElseIf: false }],
		'no-use-before-define': ['error', { functions: true, variables: true }],
		'no-duplicate-imports': 'error',
		'object-shorthand': 'error',
		'symbol-description': 'error',
		'array-callback-return': 'error',
		'default-param-last': 'error',
		'default-case-last': 'error',
		'prefer-object-spread': 'error',
		'wrap-regex': 'error',
		'prefer-exponentiation-operator': 'error',
		'prefer-template': 'error',
		'space-infix-ops': 'error',
		'handle-callback-err': 'error',
		'newline-before-return': 'error',
		'arrow-spacing': 'error',
		'prefer-const': [
			'error',
			{ destructuring: 'all', ignoreReadBeforeAssign: false },
		],
		eqeqeq: ['error', 'always'],
		'newline-after-var': ['off', 'always'],
		'arrow-parens': ['error', 'always'],
		'max-depth': ['error', 4],
		'max-nested-callbacks': ['warn', 4],
		'func-style': ['error', 'expression'],
		'semi-style': ['error', 'last'],
		'space-before-blocks': ['off', 'never'],
		'space-before-function-paren': ['warn', 'never'],
		'space-in-parens': ['error', 'never'],
		'init-declarations': ['error', 'always'],
		'prettier/prettier': 'off',
		'prefer-destructuring': [
			'error',
			{
				array: true,
				object: true,
			},
			{
				enforceForRenamedProperties: false,
			},
		],
		'key-spacing': [
			'warn',
			{
				align: {
					beforeColon: true,
					afterColon: true,
					on: 'colon',
				},
			},
		],
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
        "@typescript-eslint/no-var-requires": "warn"
	},
};
