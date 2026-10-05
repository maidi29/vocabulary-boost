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
            // Only expose what the scripts need, not the whole build environment
            'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
        })
    ]
}
