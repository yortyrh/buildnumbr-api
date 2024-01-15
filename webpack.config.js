// eslint-disable-next-line @typescript-eslint/no-var-requires
const TerserPlugin = require('terser-webpack-plugin');

module.exports = function (options) {
  console.log(options.entry);
  return {
    ...options,
    entry: {
      lambda: {
        import: './apps/dynamodbsample1/src/lambda.ts',
      },
      main: {
        import: './apps/dynamodbsample1/src/main.ts',
      },
    },
    output: {
      ...options.output,
      libraryTarget: 'commonjs2',
      filename: '[name].js',
      sourceMapFilename: '[name].map',
      chunkFilename: '[id].js',
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_classnames: true,
          },
        }),
      ],
    },
  };
};
