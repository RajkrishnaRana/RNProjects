module.exports = {
    presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
    plugins: [
        ...(process.env.NODE_ENV === 'production'
            ? ['transform-remove-console']
            : []),
        'react-native-reanimated/plugin',
    ],
};
