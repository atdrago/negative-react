const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

module.exports = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx'],
    // Allow imports relative to `baseUrl` in tsconfig.json
    plugins: [new TsconfigPathsPlugin()],
  },
};
