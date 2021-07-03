import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/*.spec.ts',
    '!<rootDir>/src/migrations/*.ts',
    '!<rootDir>/src/seeds/**/*.ts',
  ],
  coverageDirectory: '<rootDir>/coverage',
  globalSetup: '<rootDir>/test/helpers/jest/e2e-global-setup.ts',
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: {
    '@api-test-helpers/(.*)': '<rootDir>/test/helpers/$1',
    '@api/(.*)': '<rootDir>/src/$1',
  },
  rootDir: '.',
  testEnvironment: '<rootDir>/test/helpers/jest/e2e-test-environment.ts',
  testRegex: '.*.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};

// eslint-disable-next-line import/no-default-export
export default config;
