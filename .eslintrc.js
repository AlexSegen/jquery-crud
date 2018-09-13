// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  globals: {
    APIS: true,
    COOKIES: true,
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: ['airbnb-base'],
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.config.js'
      }
    }
  },
  // add your custom rules here
  rules: {
    'import/extensions': ['error', 'always', {
      js: 'never',
    }],
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
      ]
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
