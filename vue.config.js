// vue.config.js
const path = require("path");
const resolve = (dir) => path.join(__dirname, dir);
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

let cesiumSource = "./node_modules/cesium/Source";
let cesiumWorkers = "../Build/Cesium/Workers";

module.exports = {
  chainWebpack: (config) => {
    // 当有很多页面时，会导致太多无意义的请求
    config.plugins.delete("prefetch");

    config.resolve.alias
      .set("@", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("page", resolve("src/views"));
  },
  // 基本路径  3.6之前的版本时 baseUrl
  publicPath: "./",
  // 输出文件目录
  outputDir: "dist",
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  // webpack-dev-server 相关配置
  devServer: {
    open: process.platform === "darwin",
    host: "0.0.0.0",
    port: 5000,
    https: false,
    hotOnly: false,
  },
  configureWebpack: {
    output: {
      sourcePrefix: " ",
    },
    amd: {
      toUrlUndefined: true,
    },
    resolve: {
      alias: {
        vue$: "vue/dist/vue.esm.js",
        "@": path.resolve("src"),
        cesium: path.resolve(__dirname, cesiumSource),
      },
    },
    plugins: [
      new CopyWebpackPlugin([
        { from: path.join(cesiumSource, cesiumWorkers), to: "Workers" },
      ]),
      new CopyWebpackPlugin([
        { from: path.join(cesiumSource, "Assets"), to: "Assets" },
      ]),
      new CopyWebpackPlugin([
        { from: path.join(cesiumSource, "Widgets"), to: "Widgets" },
      ]),
      new CopyWebpackPlugin([
        {
          from: path.join(cesiumSource, "ThirdParty/Workers"),
          to: "ThirdParty/Workers",
        },
      ]),
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify("./"),
      }),
    ],
    module: {
      unknownContextCritical: /^.\/.*$/,
      unknownContextCritical: false,
    },
  },
};
