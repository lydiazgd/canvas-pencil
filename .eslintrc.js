module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: 'airbnb-base',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "indent": ["error", 4],
    "class-methods-use-this": 0,
    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
    "no-unused-expressions": ["error", { "allowShortCircuit": true }],
  },
};
