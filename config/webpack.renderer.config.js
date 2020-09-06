const path = require('path');

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    // Allow imports related to `baseUrl` in tsconfig.json
    plugins: [new TsconfigPathsPlugin()],
  },
};
