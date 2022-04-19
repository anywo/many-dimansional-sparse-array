const path = require('path');

module.exports = {
  entry: './index.ts',
  output: {
    library: {
      name: 'ManyDimansionalSparseArray',
      type: 'umd',
      export: 'default',
    },
    globalObject: 'this',
    path: path.resolve(__dirname),
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node-modules/,
      },
    ],
  },
};
