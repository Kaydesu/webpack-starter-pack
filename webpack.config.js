const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
    const IS_DEVELOPMENT = argv.mode === 'development';
    return {
        context: path.resolve(__dirname, 'src'),
        entry: {
            main: ['./app.js', './scss/main.scss']
        },
        output: {
            path: path.resolve(__dirname, 'public/'),
        },
        devtool: IS_DEVELOPMENT ? 'inline-source-map' : false,

        module: {
            rules: [
                {
                    test: /\.s[ac]ss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: IS_DEVELOPMENT,
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: () => [
                                    require('autoprefixer')({ overrideBrowserslist: ['last 2 versions'] })
                                ],
                                sourceMap: IS_DEVELOPMENT,
                            }
                        },
                        { loader: 'sass-loader', options: { sourceMap: IS_DEVELOPMENT } }
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/,
                    loader: 'file-loader',
                    options: {
                        publicPath: '../',
                        name: 'img/[path][name].[ext]',
                        emitFile: false
                    }
                },
                {
                    test: /\.js$/,
                    exclude: '/node_modules/',
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                },
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({ filename: './[name].css' }),
            new CleanPlugin(path.resolve(__dirname, '../public/'), { root: path.resolve(__dirname, '../') }),
            new CopyPlugin([{
                context: path.resolve(__dirname, './src/img'),
                from: {
                    glob: `${path.resolve(__dirname, './src/img')}/**/*`,
                    flatten: true,
                    dot: false
                },
                to: 'img/[path][name].[ext]',
            }]),
            new HtmlWebpackPlugin({
                template: './index.html',
                filename: './index.html'
            }),
        ]
    }
}
