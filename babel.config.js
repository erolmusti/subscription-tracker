module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            // Alias react-native to react-native-web for web compatibility
            'react-native': 'react-native-web',
            // Mock native-only modules for web compatibility
            'react-native/Libraries/Utilities/codegenNativeCommands': './mocks/empty.js',
          },
        },
      ],
    ],
  };
};