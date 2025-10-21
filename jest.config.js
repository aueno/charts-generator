// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',

  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react-jsx'
      }
    }
  },

  setupFilesAfterEnv: ['<rootDir>/jest.setup.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  transformIgnorePatterns: [
    '/node_modules/(?!(@sgratzl|recharts|react-katex)/)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};