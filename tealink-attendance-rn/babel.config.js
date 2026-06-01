module.exports = {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
        'babel-plugin-react-compiler',
        '@babel/plugin-transform-export-namespace-from',
        ['@babel/plugin-proposal-decorators', { legacy: true }], // required for watermelon db
        'react-native-worklets-core/plugin',
        'react-native-worklets/plugin',
    ],
    env: {
        production: {
            plugins: ['transform-remove-console'],
        },
    },
};
