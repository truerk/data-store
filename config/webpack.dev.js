const merge   = require('webpack-merge');
const config  = require('./webpack.config.js');
const webpack = require('webpack');

module.exports = merge(config, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        // contentBase: path.join(__dirname, './'),
        contentBase: config.externals.paths.dist,
        historyApiFallback: true,
        overlay: true
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map'
        }),
    ],
});