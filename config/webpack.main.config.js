const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const plugins = require('./webpack.plugins');

module.exports = {
  entry: './src/main/index.ts',
  module: {
    rules: require('./webpack.rules'),
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
    // Allow imports relative to `baseUrl` in tsconfig.json
    plugins: [new TsconfigPathsPlugin()],
  },
};
