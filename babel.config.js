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
            'react-native/Libraries/Renderer/shims/ReactNative': './mocks/empty.js',
            // Fix Platform module resolution for web
            'react-native/Libraries/Utilities/Platform': 'react-native-web/dist/exports/Platform',
            // Alias react-native to react-native-web for web compatibility
            'react-native': 'react-native-web',
          },
        },
      ],
    ],
  };
};