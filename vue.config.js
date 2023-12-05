/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
    devServer: {
        client: {
            overlay: false, // !!! This fix : ResizeObserver loop limit exceeded
        },
    }
}
