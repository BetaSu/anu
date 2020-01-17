const path = require('path');
const es3ifyPlugin = require('es3ify-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const outputPath = path.resolve(__dirname, 'dist');

module.exports = {
    entry: path.resolve(__dirname, './packages/render/dom/index.ie8.js'),
    output: {
        path: outputPath,
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx'],
        alias: {
            react: path.resolve(__dirname, './packages/render/dom/index.ie8.js'),
            'react-dom': path.resolve(__dirname, './packages/render/dom/index.ie8.js'),
            'prop-types': path.resolve(__dirname, './lib/ReactPropTypes.js'),
            'create-react-class': path.resolve(
                __dirname,
                './lib/createClass.js'
            )
        }
    },
    devtool: 'source-map',//不使用eval方便调试
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader?cacheDirectory']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loade']
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 100,
                            name: 'asset/[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    mode: 'development',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    },
    plugins: [
        new es3ifyPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './index.html')
        })
    ]
};
