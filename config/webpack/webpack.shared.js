const path = require('path');
const webpack = require('webpack');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const EnvironmentPlugin = require('webpack/lib/EnvironmentPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const get = require("lodash.get")
const { map } = require("@code.gov/cautious")

const rootDir = path.dirname(path.dirname(__dirname))
console.log("process.env.CODE_GOV_API_BASE:", process.env.CODE_GOV_API_BASE)
console.log("process.env.CODE_GOV_API_KEY:", process.env.CODE_GOV_API_KEY)

// https://webpack.js.org/guides/public-path/
const ASSET_PATH = process.env.ASSET_PATH || '/';
console.log("process.env.ASSET_PATH:", process.env.ASSET_PATH)

let OUTPUT_PATH;
if (process.env.OUTPUT_PATH) {
  OUTPUT_PATH = process.env.OUTPUT_PATH
} else if (process.env.OUTPUT_RELATIVE_PATH) {
  OUTPUT_PATH = path.join(rootDir, process.env.OUTPUT_RELATIVE_PATH)
} else {
  OUTPUT_PATH = path.join(rootDir, '/dist')
}
console.log("OUTPUT_PATH:", OUTPUT_PATH)

if (!OUTPUT_PATH) {
  throw new Error("Please define an output path")
}

const entry = {
  index: ['@babel/polyfill', './src/index.js'],
}

/*
code to load plugins
const { plugins } = require(path.join(rootDir, "/config/site/site.json"))
console.log("plugins:", plugins)
map(plugins, ({component, route}) => {
  entry[path.join('plugins/', component)] = component
})
console.log("entry:", entry)
*/

module.exports = {
  output: {
    chunkFilename: '[name].bundle.js',
    filename: '[name].bundle.js',
    path: OUTPUT_PATH,
    publicPath: ASSET_PATH
  },
  entry,
  resolve: {
    modules: ['node_modules', 'src', 'config'],
    extensions: ['.js', '.json', '.md']
  },
  module: {
    rules: [{
        test: /\.(ttf|eot|woff|woff2|svg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/'
          }
        }]
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader", // creates style nodes from JS strings
          "css-loader", // translates CSS into CommonJS
          {
            loader: "sass-loader", // compiles Sass to CSS
            options: {
              implementation: require('sass')
            }
          }
        ]
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-transform-arrow-functions',
              '@babel/plugin-transform-classes',
              '@babel/plugin-syntax-dynamic-import',
              'babel-plugin-dynamic-import-node',
              'babel-plugin-transform-function-bind',
              '@babel/plugin-transform-regenerator'
            ],
            presets: [
              "@babel/preset-env",
              "@babel/preset-react"
            ]
          }
        }
      },
      {
        test: /\.md$/,
        use: [
            {
                loader: "html-loader"
            },
            {
                loader: "markdown-loader",
                options: {
                    /* your options here */
                }
            }
        ]
      }
    ]
  },
  plugins: [
    new DefinePlugin({
      'ASSET_PATH': JSON.stringify(ASSET_PATH)
    }),
    new EnvironmentPlugin(["CODE_GOV_API_BASE", "CODE_GOV_API_KEY"]),
    new CleanWebpackPlugin([OUTPUT_PATH], { root: rootDir }),
    new CopyWebpackPlugin([
      {
        from: '.nojekyll',
        to: path.join(OUTPUT_PATH, '.nojekyll')
      },
      {
        from: './assets/img',
        to: path.join(OUTPUT_PATH, '/assets/img')
      },
      {
        from: './404.html',
        to: path.join(OUTPUT_PATH, '404.html')
      },
      {
        from: 'node_modules/@code.gov/code-gov-style/dist/js/code-gov-web-components.js',
        to: 'code-gov-web-components.js'
      },
      {
        from: 'node_modules/@webcomponents/custom-elements/custom-elements.min.js',
        to: 'polyfills/custom-elements.js'
      },
      {
        from: 'node_modules/custom-event-polyfill/polyfill.js',
        to: 'polyfills/custom-event.js'
      },
      {
        from: 'node_modules/whatwg-fetch/dist/fetch.umd.js',
        to: 'polyfills/fetch.js'
      },
      {
        from: 'node_modules/url-search-params-polyfill/index.js',
        to: 'polyfills/url-search-params.js'
      }
    ]),
    new FaviconsWebpackPlugin('./assets/img/favicon.png'),
    new HtmlWebpackPlugin({
      hash: true,
      template: 'index.html',
      templateParameters: {
        ASSET_PATH
      },
      title: 'caribou',
    })
  ],
}