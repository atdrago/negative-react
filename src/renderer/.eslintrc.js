module.exports = {
  extends: 'react-app',
  settings: {
    'import/resolver': {
      webpack: { config: 'config/webpack.renderer.config.js' },
    },
  },
};
