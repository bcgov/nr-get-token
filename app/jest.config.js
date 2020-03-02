module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: [
    '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)'
  ],
  testPathIgnorePatterns: ['frontend'],
  testURL: 'http://localhost/',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js', '!src/frontend/**/*.*']
};
