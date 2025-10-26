const production = require('./webpack.prod.js');
const { merge } = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env, argv) => {
  const prodConfig = typeof production === 'function' ? production(env, argv) : prod;
  return merge(prodConfig, {
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        openAnalyzer: true,
      }),
    ],
  });
};
