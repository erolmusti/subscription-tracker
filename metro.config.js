const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable web support
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add support for additional asset extensions
config.resolver.assetExts.push(
  // Adds support for `.db` files for SQLite databases
  'db'
);

// Add explicit module resolution for problematic react-native-web paths
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'react-native-web/Libraries/Renderer/shims/ReactNative': path.resolve(__dirname, 'mocks/empty.js'),
};

module.exports = config;