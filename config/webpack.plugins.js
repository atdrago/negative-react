const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  new CopyPlugin({
    patterns: [
      {
        from: path.resolve(
          __dirname,
          '../src/main/services/window/window-preload.js',
        ),
        to: path.resolve(__dirname, '../.webpack/main/'),
      },
    ],
  }),
];
