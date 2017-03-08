/*eslint no-path-concat:0, comma-dangle:0 */
/*eslint-env node, es6 */
'use strict'
const path = require('path')
const failPlugin = require('webpack-fail-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    devtool: 'source-map',
    context: path.join(__dirname),
    entry: './src/main.jsx',
    output: {
        filename: 'bundleJavaWorkshopProject.js',
        path: path.join(__dirname, 'target'),
    },
    plugins: [
        failPlugin,
        new CopyWebpackPlugin([
            {from: 'src/index.html'},
            {context: 'src', from: '*.css'}

        ])
    ],
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        lodash: '_',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },
    module: {
        loaders: [
            {test: /\.js$/, loaders: ['babel-loader']},
            {test: /.jsx?$/, include: path.join(__dirname, 'src'), loader: 'babel-loader'},
        ]
    }
}
