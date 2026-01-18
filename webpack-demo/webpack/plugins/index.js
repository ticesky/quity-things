const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

function getHtmlWebpackPlugins() {
    return [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(process.cwd(), 'src/index.html'),
        }),
    ];
}

const miniCssExtractPlugin = new MiniCssExtractPlugin({
    filename: 'css/[name].[contenthash].css',
    chunkFilename: 'css/[name].chunk.[contenthash].css',
});

const copyWebpackPlugin = new CopyWebpackPlugin({
    patterns: [{ from: 'public', to: '' }],
});

function getTsCheckerPlugin({ isProd }) {
    return new ForkTsCheckerWebpackPlugin({
        typescript: {
            // 相对于命令行的位置
            configFile: 'tsconfig.json',
        },
        //  生产环境建议设置为 false，确保类型错误会导致构建失败
        async: !isProd,
    });
}

module.exports = {
    getHtmlWebpackPlugins,
    miniCssExtractPlugin,
    copyWebpackPlugin,
    getTsCheckerPlugin,
};
