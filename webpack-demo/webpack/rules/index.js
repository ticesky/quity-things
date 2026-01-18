const { getJsLikeRules } = require('./babel.js');
const { getScssRules, getLessRules, getCssRules } = require('./style.js');
const { getResourceRules, getSvgRules } = require('./assets.js');

/**
 * 获取所有 webpack 规则
 * @param {Object} options - 配置选项
 * @param {boolean} [options.isDev=false] - 是否为开发环境
 * @param {Array<'js'|'scss'|'less'|'css'|'resource'|'svg'>} [options.excludes=[]] - 要排除的规则类型，主要是为了兼容rspack
 * @returns {Array} webpack 规则数组
 */
function getRules({ isDev = false } = {}) {
    return [
        ...getJsLikeRules({ isDev }),
        ...getScssRules({ isDev }),
        ...getLessRules({ isDev }),
        ...getCssRules({ isDev }),
        ...getResourceRules(),
        ...getSvgRules(),
    ];
}

module.exports = {
    getRules,
};
