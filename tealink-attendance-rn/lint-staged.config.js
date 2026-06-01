module.exports = {
    // JavaScript/TypeScript files
    '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],

    // Style files
    '*.{json,css,scss,md}': ['prettier --write'],

    // Run tests for changed test files
    // '*.{spec,test}.{js,jsx,ts,tsx}': [
    //     'npm test -- --findRelatedTests',
    // ],
};
