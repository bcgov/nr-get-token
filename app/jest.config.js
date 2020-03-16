module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/docs/*.*',
    '!src/frontend/**/*.*',
    '!src/migrations/*.js'
  ],
  moduleFileExtensions: ['js', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: [
    '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)'
  ],
  testPathIgnorePatterns: ['frontend'],
  testResultsProcessor: 'jest-sonar-reporter',
  testURL: 'http://localhost/'
};