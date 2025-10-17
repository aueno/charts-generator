// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.tsx'],
  moduleNameMapper: {
  // map imports like '@/app/components/dashboard/components/input' to src/app/components/input
  '^@/app/components/dashboard/components/(.*)$': '<rootDir>/src/app/components/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { isolatedModules: true }],
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};
