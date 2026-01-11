'use strict'

const path = require('path')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: './src/js/main.ts',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true // nettoie dist à chaque build
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist')
        },
        port: 8080,
        hot: true
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './src/index.html' })
    ],
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][hash][ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][hash][ext]'
                }
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(scss)$/,
                use: [

                    'style-loader', // Adds CSS to the DOM by injecting a `<style>` tag
                    'css-loader', // Interprets `@import` and `url()` like `import/require()` and will resolve them
                    {
                        // Loader for webpack to process CSS with PostCSS
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    autoprefixer
                                ]
                            }
                        }
                    },
                    {
                        // Loads a SASS/SCSS file and compiles it to CSS
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                // Optional: Silence Sass deprecation warnings. See note below.
                                silenceDeprecations: [
                                    'mixed-decls',
                                    'color-functions',
                                    'global-builtin',
                                    'import'
                                ]
                            },
                            warnRuleAsWarning: false,
                        }
                    }
                ]
            }
        ]
    }
}