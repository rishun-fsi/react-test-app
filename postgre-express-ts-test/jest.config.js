module.exports = {
  testEnvironment: 'node',
  setupFiles: ["dotenv/config"],
  roots: ['<rootDir>/src/test'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};