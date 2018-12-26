const path = require('path');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');
const webpack = require('webpack');

const frontConfig = {
    // Stuff the entire webpack-front.config.js
    // without the require and module.exports lines
    target: 'web',
    watch: true,
    watchOptions: {
        ignored: /node_modules/,
    },
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
    devtool: 'sourcemap',
};
const backConfig = {
    // Stuff the entire webpack-back.config.js
    // without the require and module.exports lines
    target: 'node',
    watch: true,
    watchOptions: {
        ignored: /node_modules/,
    },
    mode: 'development',
    entry: {
        app: ['./src/back/app.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle-back.js',
    },
    externals: [nodeExternals()],
    plugins: [
        new NodemonPlugin(), // Dong
        new webpack.IgnorePlugin(/\.(css|less)$/),
        new webpack.BannerPlugin({
            banner: 'require("source-map-support").install();',
            raw: true,
            entryOnly: false,
        }),
    ],
    devtool: 'sourcemap',
};
// Combined 'module.exports'
module.exports = [frontConfig, backConfig];
