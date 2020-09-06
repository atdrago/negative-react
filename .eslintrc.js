module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  parser: '@typescript-eslint/parser',
  rules: {
    '@typescript-eslint/interface-name-prefix': ['error', 'always'],
  },
  settings: {
    'import/resolver': { webpack: { config: 'config/webpack.main.config.js' } },
  },
};
