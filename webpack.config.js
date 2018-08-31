const path = require('path');

module.exports = {
  entry: './lib/index.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'node'),
    library: 'universalAnitracker',
    libraryTarget: 'umd',
    globalObject: 'this',
    libraryExport: 'default',
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
};
