// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        isolatedModules: true, // ← tsconfigに移しても良い
        useESM: false,
      },
    ],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@sgratzl|recharts|react-katex)/)', // ← 外部ESMライブラリを変換対象にする
  ],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};