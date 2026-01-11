const path = require('path')
const autoprefixer = require('autoprefixer')
const { merge } = require('webpack-merge')

module.exports = merge(require('./webpack.common'), {
    mode: 'development',

    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },

    devServer: {
        static: path.resolve(__dirname, 'dist'),
        port: 8080,
        hot: true
    },

    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [autoprefixer]
                            }
                        }
                    },
                    'sass-loader'
                ]
            }
        ]
    }
})
