const path = require("node:path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  context: path.resolve(__dirname, ".."),
  entry: {
    index: "./index.js",
  },

  stats: {
    loggingDebug: ["sass-loader"],
  },
  resolve: {
    alias: {
      "@fonts": path.join(__dirname, "..", "src", "assets", "fonts"),
    },
  },
  plugins: [
    // new CopyPlugin({
    //   patterns: [{ from: "src/assets/copy-folder", to: "public/images" }],
    // }),
    new HtmlWebpackPlugin({
      title: "testing",
      filename: "index.html",
      template: "./index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "public/[name][ext]",
        },
      },

      {
        test: /\.(png|jpe?g|avif|svg|webp)$/i,
        type: "asset", // Automatically chooses between inline/resource
        generator: {
          filename: "public/[name][ext]",
          filename: (ob) => {
            const params = new URLSearchParams(
              ob.module.resourceResolveData.query
            );
            // Get the value of the 'w' parameter
            const width = params.get("w");
            const height = params.get("h");
            if (width) {
              return `public/[name]-${width}x${height}[ext]`;
            }
            return `public/[name][ext]`;
          },
        },
        parser: {
          dataUrlCondition: {
            maxSize: 1 * 1024, // 1kb - files smaller will be inlined
          },
        },
      },

      {
        test: /sprite\.svg$/,
        type: "asset/resource",
        generator: {
          filename: "public/[name][ext]",
        },
      },
    ],
  },
};
