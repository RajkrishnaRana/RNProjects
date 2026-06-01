module.exports = {
    presets: ['module:@react-native/babel-preset'],
    plugins: ['babel-plugin-react-compiler', 'react-native-reanimated/plugin'],
    env: {
        production: {
            plugins: ['transform-remove-console'],
        },
    },
};
