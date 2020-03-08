// eslint-disable-next-line
const path = require(`path`);

module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                [`@Types`]: path.join(__dirname, `src/types`),
                [`@Components`]: path.join(__dirname, `src/components/`),
                [`@Helpers`]: path.join(__dirname, `src/helpers`),
                [`@Store`]: path.join(__dirname, `src/store`),
            },
            extensions: [`.js`, `.ts`, `.vue`],
        },
    },
};
