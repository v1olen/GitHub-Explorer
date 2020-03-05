module.exports = {
    "env": {
        "browser": true,
        "es6": true,
    },
    "extends": [
        `plugin:vue/recommended`,
        `@vue/typescript/recommended`,
    ],
    "globals": {
        "Atomics": `readonly`,
        "SharedArrayBuffer": `readonly`,
    },
    "parserOptions": {
        "ecmaVersion": 2020,
        "sourceType": `module`,
    },
    "plugins": [
        `vue`,
    ],
    "rules": {
        "indent": [
            `error`,
            4,
        ],
        "linebreak-style": [
            `error`,
            `unix`,
        ],
        "quotes": [
            `error`,
            `backtick`,
        ],
        "comma-dangle": [
            `error`,
            `always-multiline`,
        ],
        "semi": [
            `error`,
            `always`,
        ],
        "vue/html-indent": [
            `error`,
            4,
        ],
        "vue/html-closing-bracket-spacing": [
            `off`,
        ],
        "vue/no-v-html": [
            `off`,
        ],
        "vue/max-attributes-per-line": [`error`, {
            "singleline": 2,
            "multiline": {
                "max": 2,
                "allowFirstLine": false,
            },
        }],
        "@typescript-eslint/camelcase": [
            `off`
        ],
    },
};
