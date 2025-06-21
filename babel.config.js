module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          alias: {
            'react-native-pager-view': 'react-native-web/dist/exports/View',
          },
          platforms: ['web'],
        },
      ],
    ],
  };
};