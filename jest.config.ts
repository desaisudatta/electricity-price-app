import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Ensure this points to the correct setup file
  moduleNameMapper: {
    // Adjust this mapping if needed
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1', // Adjusting for src/lib path
    '^@/components/(.*)$': '<rootDir>/src/components/$1', // Ensure this is correct
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
