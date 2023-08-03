export default {
  testRegex: '/test/.*-test.ts$',
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^.$.js': '$1',
  },
  setupFiles: ['<rootDir>/test/setup.ts'],
}
