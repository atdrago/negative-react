const path = require('path');

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const plugins = require('./webpack.plugins');

module.exports = {
  entry: './src/main/index.ts',
  module: {
    rules: require('./webpack.rules'),
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    // Allow imports related to `baseUrl` in tsconfig.json
    plugins: [new TsconfigPathsPlugin()],
  },
};
