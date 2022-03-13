const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: __dirname + '/src',
  entry: './ts/index',
  mode: 'production',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        // 拡張子 .ts の場合
        test: /\.ts$/,
        // TypeScript をコンパイルする
        use: 'ts-loader',
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      }
    ]
  },
  resolve: {
    // 拡張子を配列で指定
    extensions: [
      '.ts', '.js',
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'html', 'index.html'), // パスの指定
      filename: 'index.html'  // dist/html/以下にindex.htmlをビルド
    }),
    new MiniCssExtractPlugin({
      filename: "style.css"
    })
  ],
  devServer: {
    static: './dist',
    port: 3000,
    open: true,
    client: {
      overlay: false,
    },
  }
};