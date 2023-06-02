const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/index.ts', // The entry point of your application
  target: 'node', // Target node
  externals: [nodeExternals()], // Exclude node_modules
  module: {
    rules: [
      {
        test: /\.ts$/, // All ts files will be handled by ts-loader
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts'], // Resolve these extensions
  },
  output: {
    path: path.resolve(__dirname, 'dist'), // The output directory
    filename: 'index.js', // The name of the output file
  },
};
