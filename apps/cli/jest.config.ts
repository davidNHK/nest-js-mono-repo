import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/**/*.spec.ts'],
  coverageDirectory: '<rootDir>/coverage',
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: {
    '@cli-test-helpers/(.*)': '<rootDir>/test/helpers/$1',
    '@cli/(.*)': '<rootDir>/src/$1',
  },
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.*.spec.ts$',
};

// eslint-disable-next-line import/no-default-export
export default config;
