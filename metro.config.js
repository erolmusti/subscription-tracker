const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure Metro can resolve all necessary modules
config.resolver.platforms = ['native', 'ios', 'android', 'web'];

module.exports = config;