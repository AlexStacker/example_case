module.exports = {
  root: true,
  env: {
    node: true
  },
  parser: 'typescript-eslint-parser',
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript'
  ],
  plugins:[
    "vue"
  ],
  rules: {
    'semi': ['error', 'always'],
    'eqeqeq': ['error', 'smart'],
    'space-before-function-paren': [2, 'never'], // 函数前不允许有空格
    'no-unused-vars': [2, {
      'vars': 'all',
      'args': 'none'
    }], // 不允许无用的变量
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {}
}
