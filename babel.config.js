module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            // Mock native-only modules for web compatibility
            'react-native/Libraries/Utilities/codegenNativeCommands': './mocks/empty.js',
          },
        },
      ],
    ],
  };
};