const path = require('path');
const crypto = require('crypto');
const _ = require('lodash');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const ROOT = path.resolve('src');

// 用于本地调试阶段构建 className
const getLocalIdentDev = (context, _, localName) => {
    const filePathRelative = path
        .relative(ROOT, context.resourcePath)
        .replace(/\\/g, '/'); // 兼容 Windows 下的反斜杠
    const folderName = path.basename(path.dirname(context.resourcePath));
    const fileName = path.basename(filePathRelative, '.scss');
    const dirPath = path.dirname(filePathRelative);

    // 过滤 index.scss、index.module.scss，避免无意义 class 冗余
    const cleanPath =
        fileName === 'index' || fileName === 'index.module'
            ? dirPath
            : path.join(dirPath, fileName);

    // 替换 / 和特殊符号为 -，防止 className 含非法字符
    const safePath = cleanPath.replace(/[^a-zA-Z0-9]/g, '-');
    const finalPath = safePath.length < 50 ? safePath : folderName;
    const hash = crypto
        .createHash('sha256')
        .update(filePathRelative + localName)
        .digest('hex') // base64 可能含有不合法字符
        .substring(0, 4); // 控制长度

    // 最终 class 格式： btn__components-MyButton__1a2b
    return `${localName}__${finalPath}__${hash}`;
};

// 基础 CSS Loader
const createCssLoaders = (
    isDev = false,
    { modules = false, importLoaders = 0 } = {},
) => [
    !isDev ? MiniCssExtractPlugin.loader : 'style-loader',
    {
        loader: 'css-loader',
        options: {
            importLoaders,
            esModule: false,
            ...(modules && {
                modules: _.omitBy(
                    {
                        exportLocalsConvention: 'camelCase',
                        localIdentName: !isDev
                            ? '[local]__[hash:base64]'
                            : undefined,
                        getLocalIdent: isDev ? getLocalIdentDev : undefined,
                    },
                    _.isUndefined,
                ),
            }),
        },
    },
    'postcss-loader',
];

// 生成 SCSS 通用 loader 配置
const createScssLoaders = (isDev = false, modules) => [
    ...createCssLoaders(isDev, { modules, importLoaders: 3 }),
    {
        loader: 'resolve-url-loader',
        options: {
            sourceMap: true,
        },
    },
    {
        loader: 'sass-loader',
        options: {
            sourceMap: true,
        },
    },
];

const createLessLoaders = (isDev = false, modules) => [
    ...createCssLoaders(isDev, {
        modules,
        importLoaders: 2,
    }),
    {
        loader: 'less-loader',
        options: {
            lessOptions: {
                javascriptEnabled: true,
            },
        },
    },
];

const getScssRules = ({ isDev = false } = {}) => [
    {
        test: /\.module\.scss$/,
        include: ROOT,
        use: createScssLoaders(isDev, true),
    },
    {
        test: /\.scss$/,
        exclude: /\.module\.scss$/,
        include: ROOT,
        use: createScssLoaders(isDev, false),
    },
];

const getLessRules = ({ isDev = false } = {}) => [
    {
        test: /\.module\.less$/,
        include: ROOT,
        use: createLessLoaders(isDev, true),
    },
    {
        test: /\.less$/,
        exclude: /\.module\.less$/,
        include: ROOT,
        use: createLessLoaders(isDev, false),
    },
];

const getCssRules = ({ isDev = false } = {}) => {
    return [
        {
            test: /\.module\.css$/,
            include: ROOT,
            use: createCssLoaders(isDev, { modules: true }),
        },
        {
            test: /\.css$/,
            exclude: /\.module\.css$/,
            resourceQuery: { not: [/url/] },
            include: ROOT,
            use: createCssLoaders(isDev),
        },
        {
            test: /\.css$/,
            exclude: /\.module\.css$/,
            resourceQuery: /url/,
            include: ROOT,
            type: 'asset/resource',
        },
    ];
};

module.exports = {
    getScssRules,
    getLessRules,
    getCssRules,
};
