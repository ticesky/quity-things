/**
 * @typedef {import('http-proxy-middleware').Options} ProxyOptions
 */

/**
 * @returns {ProxyOptions[]}
 */
module.exports = function () {
    return [
        {
            context: ['/test1/'],
            logLevel: 'silent',
            target: 'http://www.test1.com',
            changeOrigin: true,
        },
        {
            context: ['/test2/'],
            logLevel: 'silent',
            target: 'http://10.11.133.111:8310',
            changeOrigin: true,
        },
    ].filter(Boolean);
};
