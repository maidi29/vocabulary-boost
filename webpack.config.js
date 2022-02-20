const path = require('path');
module.exports = {
    mode: "production",
    entry: "./src/background.ts",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "background.js"
    },
    resolve: {
        extensions: ['.ts', '.tsx'],
        fallback: {
            "buffer": require.resolve("buffer/")
        }
    },
    module:{
        rules:[{
            loader: 'babel-loader',
            test: /\.ts$|tsx/,
            exclude: /node_modules/
        }]
    },
}
