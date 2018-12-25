const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');

const frontConfig = {
    // Stuff the entire webpack-front.config.js
    // without the require and module.exports lines
    target: 'web',
    mode: 'development',
    entry: {
        app: ['./src/front/index.js'],
    },
    output: {
        path: path.resolve(__dirname, 'public/javascript'),
        filename: 'bundle-front.js',
    },
    devServer: {
        host: 'localhost', // Required for docker
        publicPath: '/public/',
        contentBase: path.resolve(__dirname, './views'),
        watchContentBase: true,
        compress: true,
        port: 8080,
    },
    devtool: 'inline-source-map',
};
const backConfig = {
    // Stuff the entire webpack-back.config.js
    // without the require and module.exports lines
    target: 'node',
    mode: 'development',
    entry: {
        app: ['./src/back/app.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle-back.js',
    },
    externals: [nodeExternals()],
};
// Combined 'module.exports'
module.exports = [frontConfig, backConfig];
