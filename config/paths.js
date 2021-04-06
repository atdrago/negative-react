const path = require('path');

module.exports = {
  appPath: path.resolve(__dirname, '../out/Negative-darwin-x64/Negative.app'),
  entitlements: path.resolve(__dirname, './entitlements.plist'),
  webpackMainDir: path.resolve(__dirname, '../.webpack/main/'),
  windowPreloadScript: path.resolve(
    __dirname,
    '../src/main/services/window/window-preload.js',
  ),
};
