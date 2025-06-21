module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'expo-router/babel',
      [
        'module-resolver',
        {
          alias: {
            // Mock native-only modules for web compatibility
            'react-native/Libraries/Utilities/codegenNativeCommands': './mocks/empty.js',
            // Fix Platform module resolution for react-native-web
            'react-native/Libraries/Utilities/Platform': 'react-native-web/dist/exports/Platform',
          },
        },
      ],
    ],
  };
};