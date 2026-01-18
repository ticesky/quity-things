const getJsLikeRules = ({ isDev = false } = {}) => [
    {
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules\/(?!(@some-esm-lib|another-lib))/,
        loader: require.resolve('babel-loader'),
        options: {
            presets: [
                [
                    require('@babel/preset-env').default,
                    {
                        useBuiltIns: 'entry',
                        corejs: '3',
                    },
                ],
                [
                    require('@babel/preset-react').default,
                    {
                        development: isDev,
                        // 无需手动 import React
                        runtime: 'automatic',
                    },
                ],
                [require('@babel/preset-typescript').default],
            ],
            cacheDirectory: true,
            cacheCompression: false,
            compact: !isDev,
        },
    },
];

module.exports = {
    getJsLikeRules,
};
