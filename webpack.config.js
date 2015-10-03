// -*- coding: utf-8 -*-
var path = require('path');
var webpack = require('webpack');
var BowerWebpackPlugin = require("bower-webpack-plugin");

module.exports = {
    entry: {
        'index': './src/index.js',
        'users': './src/users.js',
        'pages': './src/pages.js',
        'todo': './src/todo/main.js',
        'vendor': './entry.js',
    },
    output: {
        path: path.join(__dirname, 'var'),
        filename: '[name].bundle.js',
    },
    module: {
        loaders: [
            // { test: /\.less$/, loader: 'style!css!less' }, // use ! to chain loaders
            // { test: /\.css$/, exclude: /\.useable\.css$/, loader: 'style!css'},
            { test: /\.css$/, loader: 'style!css'},
            { test: /\.useable\.css$/, loader: 'style/useable!css' },
            { test: /\.(png|jpg)$/, loader: 'url?limit=8192' }, // inline base64 URLs for <=8k images, direct URLs for the rest,
            { test: /\.html$/, loader: "raw" },
            // for jquery
            { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery' },
            // for bootstrap css
            { test: /\.svg$/, loader: 'url-loader?mimetype=image/svg+xml'},
            { test: /\.woff$/, loader: 'url-loader?mimetype=application/font-woff'},
            { test: /\.woff2$/, loader: 'url-loader?mimetype=application/font-woff'},
            { test: /\.eot$/, loader: 'url-loader?mimetype=application/font-woff'},
            { test: /\.ttf$/, loader: 'url-loader?mimetype=application/font-woff'},
        ]
    },
    resolve: {
        root: [
            path.join(__dirname, "bower_components"),
            path.join(__dirname, "static"),
        ],
        extensions: ["", ".js", ".css", ".svg", ".woff", ".eof", ".ttf", ".png"],
    },
    plugins: [
        new BowerWebpackPlugin({excludes: /.*\.less/}),
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        ),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            m: 'mithril',
        }),
    ],
};
