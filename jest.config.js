module.exports = {
  roots: ['src'],
  cacheDirectory: '<rootDir>/.cache',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json'
    }
  }
};
