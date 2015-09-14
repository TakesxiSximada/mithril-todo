// -*- coding: utf-8 -*-
var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        index: './src/index.js',
        pages: './src/pages.js',
        vendor: [
            'mithril',
        ],
    },
    output: {
        path: path.join(__dirname, 'var'),
        filename: '[name].bundle.js',
    },
    module: {
        loaders: [
            // { test: /\.less$/, loader: 'style!css!less' }, // use ! to chain loaders
            { test: /\.css$/, exclude: /\.useable\.css$/, loader: 'style!css' },
            { test: /\.useable\.css$/, loader: 'style/useable!css' },
            { test: /\.(png|jpg)$/, loader: 'url?limit=8192' }, // inline base64 URLs for <=8k images, direct URLs for the rest,
            { test: /\.html$/, loader: "raw" }
        ]
    },
    resolve: {
        root: [path.join(__dirname, "bower_components")],
        extensions: ["", ".js"],
    },
    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        ),
        new webpack.ProvidePlugin({m: "mithril"}),
    ],
};
