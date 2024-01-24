const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "~@/styles/main.scss";`,
      },
    },
  },
  // babel: {
  //   presets: ["@babel/preset-env"],
  // },
});
