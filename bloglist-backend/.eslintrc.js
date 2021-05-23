module.exports = {
    'env': {
        //'browser':true,
        'node': true,
        'commonjs': true,
        'es6': true,
        "jest": true
    },
    'extends': 'eslint:recommended',
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 2018
    },
    'rules': {
        'indent': [
            'warn',
            2
        ],
        'linebreak-style': [
            'warn',
            'windows'
        ],
        'quotes': [
            'warn',
            'single'
        ],
        'semi': [
            'warn',
            'never'
        ],
        'eqeqeq': 'warn',
        'no-trailing-spaces': 'warn',
        'no-undef': 'off',
        'no-unused-vars': 'off',
        'object-curly-spacing': [
        'warn', 'always'
        ],
        'arrow-spacing': [
        'warn', { 'before': true, 'after': true }
        ],
	'no-console': 0
    },       
}