
const nodeExternals = require('webpack-node-externals');
const path = require('path')
module.export = {
    target: 'node',
    mode: 'production',
    entry: path.resolve(__dirname, 'src')+ '/index.js',
    // alias: {
    //     "src": path.resolve(__dirname)
    // },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [path.resolve('./src'), path.resolve(__dirname), "node_modules"]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    externals:[nodeExternals()],
    resolve: {fallback: { 
        "path": require.resolve("path-browserify"), "fs": false, "tls": false, "net": false, "http": require.resolve("stream-http"), "url": require.resolve("url/"), "stream": require.resolve("stream-browserify"),
"util": false, "crypto": require.resolve("crypto-browserify"), "https": require.resolve("https-browserify"), "zlib": require.resolve("browserify-zlib")
}},
}