const fs                     = require("fs");
const path                   = require('path');
const glob_entries           = require('webpack-glob-folder-entries')
const CopyWebpackPlugin      = require("copy-webpack-plugin");
const HtmlWebpackPlugin      = require("html-webpack-plugin");
const MiniCssExtractPlugin   = require("mini-css-extract-plugin");
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');

const PATHS = {
    src: path.resolve(__dirname, '../src'),
    dist: path.resolve(__dirname, '../dist'),
    templates: path.resolve(__dirname, '../templates'),
    templatesGlob: path.resolve(__dirname, '../templates/pages/**/'),
    pages: path.resolve(__dirname, '../templates/pages'),
    assets: 'assets',
    bundles: 'bundles'
}

// Генерация папок для вьюшки nunjucks
function returnEntries(globPath){
    let entries = glob_entries(globPath, true);
    let folderList = new Array();
    for (let folder in entries){
       folderList.push(entries[folder]);
    }
    return folderList;
}

// Генерация nunjucks pages в html
function generateHtmlPlugin(templatesGlob) {
    let entries = glob_entries(templatesGlob, true);
    let pagesList = new Array();

    for (let pages in entries){
        pagesList.push(pages);
    }

    // Удаляем templates, pages

    pagesList.splice(0, 2)
    return pagesList.map(page => {
        let parts;
        let name;
        let extension;
        let chunks = []

        chunks.push(page)

        if (fs.existsSync(`${PATHS.pages}/${page}/${page}.njk`)) {
            parts = `${page}.njk`.split(".");
            name = parts[0];
            extension = parts[1];
        } else if (fs.existsSync(`${PATHS.pages}/${page}/index.njk`)) {
            parts = 'index.njk'.split(".");
            name = parts[0];
            extension = parts[1];
        }


        return new HtmlWebpackPlugin({
            // title: page,
            template: `${PATHS.pages}/${page}/${name}.${extension}`,
            filename: `./${page}.html`,
            inject: true,
            minify: true,
            // hash: false,
            chunks: chunks,
        });

    });
}

const templates = generateHtmlPlugin(PATHS.templatesGlob);


function shorten(value, count) {
    return value.slice(0, count || 5);
}

module.exports = {
    externals: {
        paths: PATHS
    },
    entry: {
        "index": [
            `${PATHS.src}/js/index.js`,
            `${PATHS.src}/scss/index.js`,
        ]
    },
    output: {
        path: PATHS.dist,
        filename: `${PATHS.bundles}/js/[name].[chunkhash].js`,
        publicPath: "/"
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
            '@': path.resolve(__dirname, '../src/js'),
        }
    },
    module: {
        rules: [
            {
                test: /\.module\.(sa|sc|c)ss$/,
                exclude: /(node_modules)/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            importLoaders: 1,
                            modules: {
                                getLocalIdent: getCSSModuleLocalIdent,
                            },
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            config: { path: path.resolve(__dirname, './postcss.config.js') }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: true }
                    },
                ]
            },
            {
                test: /\.(sa|sc|c)ss$/,
                exclude: [/(node_modules)/, /\.module\.(sa|sc|c)ss$/],
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: { sourceMap: true, }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,

                            config: { path: path.resolve(__dirname, './postcss.config.js') }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: true }
                    },
                ]
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties']
                    }
                }
            },
            {
                test: /\.m?jsx$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties']
                    }
                }
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+)?$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.html$|njk|nunjucks/,
                exclude: [/(node_modules)/, /(src)/],
                use: [
                    'html-loader',
                    {
                        loader: 'nunjucks-template-loader',
                        options: {
                            paths: [...returnEntries(path.resolve(__dirname, '../templates/**/'))],
                            filters: {
                                shorten
                            },
                            data: {
                                index: {
                                    foo: 'indexBar'
                                },
                                about: {
                                    foo: 'indexAbout'
                                }
                            }
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: `${PATHS.src}/${PATHS.assets}/`, to: `${PATHS.assets}/` },
                { from: `${PATHS.src}/static/`, to: '' }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: `${PATHS.bundles}/css/[name].[contenthash].css`,
            chunkFilename: "[id].css"
        }),
    ]
    .concat(templates),
};