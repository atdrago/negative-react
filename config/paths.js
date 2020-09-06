const path = require('path');

module.exports = {
  webpackMainDir: path.resolve(__dirname, '../.webpack/main/'),
  windowPreloadScript: path.resolve(
    __dirname,
    '../src/main/services/window/window-preload.js',
  ),
};
