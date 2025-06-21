const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable web support
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add support for additional asset extensions
config.resolver.assetExts.push(
  // Adds support for `.db` files for SQLite databases
  'db'
);

module.exports = config;