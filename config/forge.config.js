const packageJson = require('../package.json');
const paths = require('./paths');

const {
  name: executableName,
  productName: name,
  version: appVersion,
} = packageJson;

const appBundleId = `com.adamdrago.${executableName}`;
const teamName = 'Adam Drago';
const teamId = 'FPEMKZSSJC';

const config = {
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
  ],
  packagerConfig: {
    appCategoryType: 'public.app-category.developer-tools',
    appBundleId,
    appVersion,
    asar: true,
    executableName,
    name,
    osxSign: {
      app: paths.appPath,
      identity: `Developer ID Application: ${teamName} (${teamId})`,
      hardenedRuntime: true,
      'gatekeeper-assess': false,
      entitlements: paths.entitlements,
      'entitlements-inherit': paths.entitlements,
      'signature-flags': 'library',
    },
  },
  plugins: [
    [
      '@electron-forge/plugin-webpack',
      {
        mainConfig: './config/webpack.main.config.js',
        renderer: {
          config: './config/webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/renderer/index.html',
              js: './src/renderer/index.tsx',
              name: 'main_window',
            },
          ],
        },
      },
    ],
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'atdrago',
          name: 'negative-react',
        },
      },
    },
  ],
};

function notarizeMaybe() {
  if (process.platform !== 'darwin') {
    return;
  }

  if (!process.env.CI) {
    console.log(`Not in CI, skipping notarization`);
    return;
  }

  if (!process.env.APPLE_ID || !process.env.APPLE_ID_PASSWORD) {
    console.warn(
      'Should be notarizing, but environment variables APPLE_ID or APPLE_ID_PASSWORD are missing!',
    );
    return;
  }

  config.packagerConfig.osxNotarize = {
    appBundleId,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
    appPath: paths.appPath,
    ascProvider: teamId,
  };
}

notarizeMaybe();

module.exports = config;
