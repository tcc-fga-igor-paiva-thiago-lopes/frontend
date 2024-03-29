module.exports = {
    preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
    transformIgnorePatterns: [
        '/node_modules/(?!@ionic/vue|@ionic/vue-router|@ionic/core|@stencil/core|ionicons|@ckpack/vue-color)',
    ],
    verbose: true,
    // globalSetup: '<rootDir>/tests/globalSetup.ts',
    // globalTeardown: '<rootDir>/tests/globalTeardown.ts',
    collectCoverage: true,
    coverageDirectory: 'coverage/',
    collectCoverageFrom: [
        'src/**/*.{ts,js,vue}',
        '!src/database/migrations/**',
    ],
    coverageReporters: ['json', 'html'],
};
