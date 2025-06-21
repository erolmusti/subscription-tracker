module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            // Mock native-only modules for web compatibility - these must come BEFORE the general react-native alias
            'react-native/Libraries/Utilities/codegenNativeCommands': './mocks/empty.js',
            'react-native/Libraries/Renderer/shims/ReactNative': './mocks/empty.js',
            // Fix Platform module resolution for web
            'react-native/Libraries/Utilities/Platform': 'react-native-web/dist/exports/Platform',
            'react-native-web/Libraries/Renderer/shims/ReactNative': './mocks/empty.js',
            // Alias react-native to react-native-web for web compatibility - this must come AFTER specific aliases
            'react-native': 'react-native-web',
          },
        },
      ],
    ],
  };
};