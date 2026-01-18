const fs = require('fs');
const path = require('path');

function getBaiduHostOrUndefined() {
    return 'localhost.baidu.com';
}

function getServer() {
    if (fs.existsSync('.ssl/yiyan.baidu.com.crt')) {
        return {
            type: 'https',
            options: {
                key: fs.readFileSync('.ssl/yiyan.baidu.com.key'),
                cert: fs.readFileSync('.ssl/yiyan.baidu.com.crt'),
            },
        };
    }
    return {
        type: 'http',
    };
}

const context = process.cwd();

const getTarget = ({ isDev = false }) => {
    return isDev ? 'web' : ['web', 'es2015'];
};

/**
 * @type {import('webpack').Configuration['resolve']}
 */
const resolve = {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json'],
    modules: [
        context,
        // 不设置alias, 防止项目中出现多种写法, 不统一
        path.resolve(context, 'src'),
        path.resolve(context, 'node_modules'),
    ],
    mainFiles: ['index'],
    // 禁用符号链接解析，提高构建性能
    // symlinks: false,
};

/**
 * @type {import('webpack').Configuration['devServer']}
 */
const devServer = {
    // port: 8086,
    compress: true,
    hot: true,
    open: true,
    historyApiFallback: true,
    host: getBaiduHostOrUndefined(),
    allowedHosts: 'all',
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
    client: {
        overlay: {
            errors: true,
            warnings: false,
            // -- 关闭页面上的红色 error overlay
            // -- 现在 v2接口发送后必然报错，先临时关闭，用控制台看。后面再看看为啥
            runtimeErrors: false,
        },
    },
    server: getServer(),
};

const entry = {
    index: './src/index.tsx',
};

const getOutput = ({ isDev = false }) => {
    const publicPath = (() => {
        return '/';
        // return 'https://eb-static.cdn.bcebos.com/static/eb/';
    })();

    return {
        publicPath: isDev ? '/' : publicPath,
        filename: 'js/[name].[contenthash].js',
        chunkFilename: 'js/[name].[contenthash].chunk.js',
        assetModuleFilename: 'asset/[name].[contenthash][ext]',
        path: path.resolve('build'),
        clean: true,
        hashDigestLength: 8,
    };
};

module.exports = {
    entry,
    getOutput,
    context,
    resolve,
    devServer,
    getTarget,
};
