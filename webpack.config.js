const path = require('path');
module.exports = {
    mode: "production",
    entry: {
        background: './src/background.ts',
        contentscript: './src/contentscript.ts'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build')
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
