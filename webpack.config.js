const path = require('path');
const dotenv = require('dotenv')
const webpack = require('webpack');

dotenv.config();

module.exports = {
    mode: "production",
    entry: {
        background: './src/scripts/background.ts',
        contentscript: './src/scripts/contentscript.ts'
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
    plugins: [
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(process.env)
        })
    ]
}
