const getResourceRules = () => [
    {
        test: /\.(png|jpg|gif|jpeg|ico|mp3|txt|xlsx|woff|woff2|eot|ttf|otf|mp4|svga)$/i,
        type: 'asset/resource',
    },
];

// import img from './icon.svg?url' → 得到 URL
// import Icon from './icon.svg' → 得到 React 组件（用 @svgr/webpack）
const getSvgRules = () => [
    {
        test: /\.svg$/i,
        oneOf: [
            {
                resourceQuery: /^\?url$/, // './icon.svg?url'
                type: 'asset/resource',
            },
            {
                issuer: /\.[jt]sx?$/,
                resourceQuery: { not: [/url/] }, // './icon.svg'
                use: ['@svgr/webpack'],
            },
            {
                type: 'asset/resource', // css / html fallback
            },
        ],
    },
];

module.exports = {
    getResourceRules,
    getSvgRules,
};
