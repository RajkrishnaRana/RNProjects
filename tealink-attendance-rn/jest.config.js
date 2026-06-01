// module.exports = {
//   preset: 'react-native',
// };

// jest.config.js
module.exports = {
    preset: 'react-native',
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
    moduleNameMapper: {
        '\\.(ttf|otf)$': '<rootDir>/__mocks__/fileMock.js',
        '\\.(png|jpg|jpeg|gif|webp)$': '<rootDir>/__mocks__/fileMock.js',
    },

    // 🔑 CRITICAL FIX: Transform ALL common RN ESM packages
    transformIgnorePatterns: [
        '<rootDir>/node_modules/(?!(react-native|@react-native|@react-native-community|react-native-reanimated|@react-navigation|@react-navigation/.*|react-native-drawer-layout|react-native-linear-gradient|react-native-device-info|@tanstack|react-redux|redux-persist|@reduxjs/toolkit|immer|react-native-toast-message)/)',
    ],

    // Optional but recommended
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
};
