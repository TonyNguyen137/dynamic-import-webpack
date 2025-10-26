const path = require("node:path");
const HTMLInlineCSSWebpackPlugin =
  require("html-inline-css-webpack-plugin").default;
const common = require("./webpack.common");
const { merge } = require("webpack-merge");
const glob = require("glob-all");
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = (env, argv) => {
  return merge(common, {
    mode: "production",
    output: {
      path: path.resolve(__dirname, "..", "dist"),
      filename: "public/[name].[contenthash:6].min.js",
      clean: true,
      chunkFilename: (pathData) => {
        // auto-generated ID by Webpack (e.g. "src_js_components_${Component}_js")
        // (The ID is derived from your file path + filename if optimization.chunkIds is set to 'named')
        // If a chunk has an explicit name defined, id will match that name instead of the auto-generated ID.
        let id = pathData.chunk.id;
        let name = null;

        let arr = id.split("_");

        if (arr.length > 1) {
          // grab the ${Component} as a readable name.
          name = arr.at(-2);
        } else {
          // use the explicit name
          name = arr[0];
        }

        return `public/${name}.[contenthash:4].min.js`;
      },
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: function (pathData) {
          return pathData.chunk.name === "index"
            ? "public/style.[contenthash:6].min.css"
            : "public/[name].[contenthash:6].min.css";
        },
      }),

      new HTMLInlineCSSWebpackPlugin({
        filter(fileName) {
          console.log("fileName : ", fileName);
          return fileName.includes("critical");
        },
      }),

      // new PurgeCSSPlugin({
      //   paths: glob.sync(['./*.html', './index.js'], { nodir: true }),
      //   // safelist: {
      //   //   standard: [/aria/, /data/],
      //   //   deep: [/aria/, /data/, /^.*\[/],
      //   //   greedy: [/aria/, /data/, /^.*\[/],
      //   // },
      // }),
    ],
    module: {
      rules: [
        // 1. sass-loader compiles Sass to CSS,
        // 2. css-loader resolves @import and url() like import/require()
        // css-loader loads the CSS file,
        // 3. style-loader injects CSS into the DOM
        // 4. MiniCssExtractPlugin.loader extracts CSS into separate files
        // fixed order [MiniCssExtractPlugin/'style-loader', 'css-loader', 'sass-loader']
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
        },
        {
          test: /\.scss$/i,

          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader",
            "sass-loader",
          ],
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },

        {
          test: /sprite\.svg$/,
          type: "asset/resource",
          generator: {
            filename: "public/[name].[contenthash:6][ext]",
          },
        },
      ],
    },

    optimization: {
      chunkIds: "named",
      // runtimeChunk: 'single',

      // splitChunks: {
      //   chunks: 'all',

      // cacheGroups: {
      // accordion: {
      //   test: /[\\/]src[\\/]js[\\/]components[\\/]Accordion(\.js)?$/,
      //   name: 'accordion',
      //   chunks: 'async',
      //   enforce: true, // <- force its own chunk regardless of size
      // },
      // navbar: {
      //   test: /[\\/]src[\\/]js[\\/]components[\\/]Navbar-Offcanvas(\.js)?$/,
      //   name: 'navbar',
      //   chunks: 'async',
      //   enforce: true,
      // },
      // tabs: {
      //   test: /[\\/]src[\\/]js[\\/]components[\\/]Tabs(\.js)?$/,
      //   name: 'tabs',
      //   chunks: 'async',
      //   enforce: true,
      // },
      // lodash: {
      //   test: /[\\/]node_modules[\\/]lodash[\\/]/, // <– nur lodash!
      //   name: 'lodash', // <– Chunk-Name!
      // },
      // utilities: {
      //   test: /[\\/]src[\\/]js[\\/]utils[\\/]/,
      //   name: 'utilities',
      //   minSize: 0,
      //   minChunks: 2,
      // },
      // },
      // },
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            output: {
              comments: false,
            },
          },
          extractComments: false,
        }),
        new CssMinimizerPlugin(),
        // new ImageMinimizerPlugin({
        //   minimizer: {
        //     implementation: ImageMinimizerPlugin.imageminMinify,
        //     options: {
        //       // Lossless optimization with custom option
        //       // Feel free to experiment with options for better results
        //       plugins: [
        //         ['imagemin-gifsicle', { interlaced: true }],
        //         ['imagemin-pngquant', { progressive: true, quality: [0.65, 0.9], speed: 4 }],
        //         ['imagemin-mozjpeg', { optimizationLevel: 5, quality: 50 }],
        //       ],
        //     },
        //   },

        //   generator: [
        //     {
        //       type: 'asset',
        //       implementation: ImageMinimizerPlugin.imageminGenerate,
        //       options: {
        //         plugins: ['imagemin-webp'],
        //       },
        //     },
        //   ],
        // }),

        new ImageMinimizerPlugin({
          test: /\.(png|jpe?g|webp|avif)$/i,
          minimizer: {
            implementation: ImageMinimizerPlugin.sharpMinify,
            options: {
              encodeOptions: {
                // Customize your `sharp` options here
                // See https://sharp.pixelplumbing.com/api-output
                jpeg: { quality: 80, progressive: true },

                png: { compressionLevel: 9, adaptiveFiltering: true },
                webp: { quality: 75 },
                avif: { cqLevel: 30 },
              },
            },
          },
          generator: [
            {
              // You can apply generator using `?as=webp`, you can use any name and provide more options
              preset: "webp",
              // type: 'asset',

              implementation: ImageMinimizerPlugin.sharpGenerate,
              options: {
                encodeOptions: {
                  webp: {
                    quality: 70,
                  },
                },
              },
            },
            {
              // You can apply generator using `?as=avif`, you can use any name and provide more options
              preset: "avif",
              implementation: ImageMinimizerPlugin.sharpGenerate,
              options: {
                encodeOptions: {
                  avif: {
                    lossless: false,
                  },
                },
              },
            },
            {
              type: "asset",
              implementation: ImageMinimizerPlugin.sharpGenerate,
              options: {
                encodeOptions: {
                  webp: {
                    quality: 90,
                  },
                },
              },
            },
          ],
        }),
      ],
    },
  });
};

// 4756
