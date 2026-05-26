module.exports = {
    // Directorio raíz donde Jest buscará archivos
    rootDir: '.',

    // Directorios donde están los tests
    testMatch: [
        '**/tests/**/*.test.js',
        '**/tests/**/*.spec.js'
    ],

    // Directorio con los archivos a probar
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/coverage/'
    ],

    // Directorio con el código fuente
    roots: ['<rootDir>/backend-clean/src'],

    // Coverage (para SonarCloud)
    collectCoverageFrom: [
        'backend-clean/src/**/*.js',
        '!backend-clean/src/**/*.test.js',
        '!backend-clean/src/**/*.spec.js',
        '!backend-clean/src/infrastructure/http/server.js',
        '!backend-clean/src/shared/di/container.js'
    ],

    // Directorio de salida del coverage
    coverageDirectory: 'backend-clean/coverage',

    // Formato de cobertura (necesario para SonarCloud)
    coverageReporters: [
        'lcov',      // Para SonarCloud
        'text',      // Para consola
        'text-summary'
    ],

    // Entorno de pruebas
    testEnvironment: 'node',

    // Transformaciones (ninguna porque usamos JS puro)
    transform: {},

    // Timeout
    testTimeout: 10000,

    // Verbosidad
    verbose: true
};