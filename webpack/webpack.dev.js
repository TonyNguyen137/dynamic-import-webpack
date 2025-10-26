const path = require("node:path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const common = require("./webpack.common");
const { merge } = require("webpack-merge");

console.log("dirname", path.resolve(__dirname, ".."));
console.log("fonts", path.join(__dirname, "..", "src", "assets", "fonts"));

module.exports = function (env, argv) {
  console.log("env: ", env);
  console.log("argv: ", argv);
  const isServe = !!argv.env["WEBPACK_SERVE"];

  return merge(common, {
    mode: "development",
    devtool: "source-map",
    output: {
      path: path.join(__dirname, "..", "dist"),
      filename: "public/[name].min.js",
      clean: true,
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: function (pathData) {
          return pathData.chunk.name === "index"
            ? "public/style.min.css"
            : "public/[name].min.css";
        },
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [
            isServe ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
          ],
        },
        {
          test: /\.scss$/i,
          use: [
            isServe ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
            "sass-loader",
          ],
        },
      ],
    },
  });
};
