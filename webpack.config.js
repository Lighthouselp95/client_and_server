

const path = require('path')
module.export = {
    target: 'node',
    mode: 'production',
    entry: './app.js',
    alias: {
        "src": path.resolve(__dirname)
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [path.resolve('./src'), path.resolve(__dirname)]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    externals: [require('webpack-node-externals')()]
}