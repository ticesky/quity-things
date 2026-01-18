const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const BASE = require('./base');
const { getRules } = require('./rules');
const {
    getHtmlWebpackPlugins,
    getTsCheckerPlugin,
    miniCssExtractPlugin,
    copyWebpackPlugin,
} = require('./plugins');

// 核心公共业务必须的不常升级的第三方包, 防止每次上线破坏缓存
const npmCorePackages = [
    // React生态基础包
    'react',
    'react-dom',
    'clsx',
    'react-i18next',
    'react-router',
    'react-router-dom',
    'ahooks',
    // React生态基础包 - 状态管理
    'mobx',
    'mobx-react-lite',
    'redux',
    '@reduxjs/toolkit',
    'react-redux',
    // 基础库
    'axios',
    'lodash',
    'dayjs',
    'qs',
    'core-js',
    'regenerator-runtime',
    'ua-parser-js',
    'i18next',
];

const vendorCoreTest = (module) => {
    return (
        module.context &&
        npmCorePackages.some((pkg) =>
            module.context.includes(
                `/node_modules/${pkg.replace('/', '/@').replace('@', '')}`,
            ),
        )
    );
};

const specCacheGroupOpts = {
    chunks: 'all',
    priority: 30,
    enforce: true,
};

/**
 * Webpack production configuration
 * @returns {import('webpack').Configuration}
 */
module.exports = function () {
    return {
        mode: 'production',
        devtool: 'hidden-source-map',
        entry: BASE.entry,
        output: BASE.getOutput({ isDev: false }),
        context: BASE.context,
        resolve: BASE.resolve,
        target: BASE.getTarget({ isDev: false }),
        module: {
            rules: getRules({ isDev: false }),
        },
        plugins: [
            ...getHtmlWebpackPlugins(),
            miniCssExtractPlugin,
            copyWebpackPlugin,
            getTsCheckerPlugin({ isProd: true }),
        ].filter(Boolean),
        optimization: {
            runtimeChunk: 'single',
            moduleIds: 'deterministic',
            chunkIds: 'deterministic',
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    ['npm-core']: {
                        test: vendorCoreTest,
                        name: 'npm-core',
                        ...specCacheGroupOpts,
                    },
                    ['npm-antd']: {
                        test: /[\\/]node_modules[\\/](antd[\\/])/,
                        name: 'npm-antd',
                        ...specCacheGroupOpts,
                    },
                    ['npm-others']: {
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'all',
                        priority: 10,
                        reuseExistingChunk: true,
                        name: 'npm-others',
                        // name(module) {
                        //     const match = module.context.match(
                        //         /[\\/]node_modules[\\/](?:@([^\\/]+)[\\/])?([^\\/]+)/,
                        //     );
                        //     if (!match) {
                        //         return 'npm-vendor';
                        //     }
                        //     const scope = match[1] ? `@${match[1]}/` : '';
                        //     const pkgName = `${scope}${match[2]}`
                        //         .replace('/', '-')
                        //         .replace('@', '');
                        //     return `npm-others__${pkgName}`;
                        // },
                        // 避免单 chunk 过大
                        maxSize: 300 * 1024, // 300KB
                    },
                },
            },
            minimizer: [
                new TerserPlugin({
                    extractComments: false,
                    terserOptions: {
                        compress: {
                            passes: 2,
                        },
                        format: {
                            comments: false,
                        },
                    },
                }),
                new CssMinimizerPlugin(),
            ],
        },
    };
};
