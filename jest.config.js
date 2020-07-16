module.exports = {
  // collectCoverage: true,
  // collectCoverageFrom: [
  //   'app/react/**/*.{ts,tsx}',
  //   '!app/react/__tests__/api/api-test-helpers.ts',
  // ],

  // rootDir: '.',
  roots: ['<rootDir>'],

  // moduleDirectories: ['./src', 'node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // moduleFileExtensions: ['js', 'ts', 'tsx', 'json'],
  moduleNameMapper: {
    '^#components(.*)$': '<rootDir>/src/components$1',
    '^#store(.*)$': '<rootDir>/src/store$1',
    '^#utils(.*)$': '<rootDir>/src/utils$1',
    '^#views(.*)$': '<rootDir>/src/views$1',
  },
  // moduleNameMapper: {
  //   '^@components(.*)$': '<rootDir>/src/components$1',
  //   '^@constants(.*)$': '<rootDir>/src/constants$1',
  // },
  modulePaths: ['.'],

  preset: 'ts-jest',

  setupFiles: ['<rootDir>/src/setupTests.ts'],
  snapshotSerializers: ['enzyme-to-json/serializer'],

  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['./node_modules/'],
  testRegex: '/__tests__/.*\\.test.(ts|tsx)$',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest',
  },
};
