module.exports = {
    preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
    transformIgnorePatterns: [
        '/node_modules/(?!@ionic/vue|@ionic/vue-router|@ionic/core|@stencil/core|ionicons)',
    ],
    verbose: true,
    collectCoverage: true,
    coverageDirectory: 'coverage/',
    collectCoverageFrom: [
        'src/**/*.{ts,js,vue}',
        '!src/database/migrations/**',
    ],
    coverageReporters: ['json', 'html'],
};
