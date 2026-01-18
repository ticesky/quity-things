const BASE = require('./base');
const { getRules } = require('./rules');
const {
    getHtmlWebpackPlugins,
    copyWebpackPlugin,
    getTsCheckerPlugin,
} = require('./plugins');
const getProxy = require('./proxy');

/**
 * @returns {import('webpack').Configuration}
 */
module.exports = function (env = {}) {
    return {
        mode: 'development',
        devtool: 'cheap-module-source-map',
        entry: BASE.entry,
        output: BASE.getOutput({ isDev: true }),
        context: BASE.context,
        resolve: BASE.resolve,
        target: BASE.getTarget({ isDev: true }),
        module: { rules: getRules({ isDev: true }) },
        plugins: [
            ...getHtmlWebpackPlugins(),
            copyWebpackPlugin,
            getTsCheckerPlugin({ isProd: false }),
        ].filter(Boolean),
        cache: {
            type: 'filesystem',
            buildDependencies: {
                config: [__filename],
            },
        },
        optimization: {
            runtimeChunk: 'single',
            moduleIds: 'deterministic',
        },
        // stats: 'errors-warnings',
        // infrastructureLogging: {
        //     level: 'warn',
        // },
        devServer: {
            ...BASE.devServer,
            proxy: getProxy({
                target: env.test,
            }),
        },
    };
};
