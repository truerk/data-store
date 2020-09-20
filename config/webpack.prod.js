const merge                   = require('webpack-merge');
const config                  = require('./webpack.config.js');
const CompressionPlugin       = require('compression-webpack-plugin');
const { CleanWebpackPlugin }  = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(config, {
    mode: 'production',
    plugins: [
        new CleanWebpackPlugin(),
        new OptimizeCSSAssetsPlugin({
            cssProcessorOptions: {
                discardComments: {
                    removeAll: true
                }
            },
            canPrint: true
        }),
        new CompressionPlugin({
            test: /\.(js|css)(\?.*)?$/i,
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            compressionOptions: {
               level: 6,
               numiterations: 15
            }
        }),
    ],
    optimization: {
        minimize: true,
        // splitChunks: {
        //     cacheGroups: {
        //         pobeda: {
        //             name: 'pobeda-components',
        //             test: /[\\/]pobeda-components[\\/]/,
        //             chunks: 'all',
        //             enforce: true
        //         },
        //         reactVendor: {
        //             test: /[\\/]node_modules[\\/](react|simplebar-react)(.[a-zA-Z0-9.\-_]+)[\\/]/,
        //             name: "reactvendors",
        //             chunks: 'all',
        //             enforce: true,
        //         },
        //         vendor: {
        //             test: /[\\/]node_modules[\\/](?!react|simplebar-react)(.[a-zA-Z0-9.\-_]+)[\\/]/,
        //             name: 'vendors',
        //             chunks: 'all',
        //             enforce: true,
        //         },
        //     }
        // }
    },
});