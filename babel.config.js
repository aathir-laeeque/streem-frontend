module.exports = function(api) {
  api.cache(true);

  return {
    "presets": ["@babel/react", "@babel/env", "@babel/typescript"],
    "plugins": [
      [
        "babel-plugin-styled-components",
        {
          "pure": true
        }
      ],
      [
        "module-resolver",
        {
          "root": ["."],
          "alias": {
            "#i18n": "./src/i18n",
            "#assets": "./src/assets",
            "#components": "./src/components",
            "#JobComposer": "./src/JobComposer",
            "#PrototypeComposer": "./src/PrototypeComposer",
            "#mocks": "./mocks",
            "#modules": "./src/modules",
            "#store": "./src/store",
            "#utils": "./src/utils",
            "#views": "./src/views",
            "#services": "./src/services"
          }
        }
      ]
    ]
  }  
};