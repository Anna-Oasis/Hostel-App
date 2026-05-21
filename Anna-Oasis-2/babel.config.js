module.exports = function(api) {
    api.cache(true);

    return {
        presets: [["babel-preset-expo", {
            jsxImportSource: "nativewind"
        }]],

        plugins: [["module-resolver", {
            root: ["./"],

            alias: {
                "@": "./",
                "tailwind.config": "./tailwind.config.js"
            }
            }],
            "nativewind/babel",
            'react-native-reanimated/plugin',
        ]
    };
};