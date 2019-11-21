const path = require('path');
const pluginsConfig = require("./webpack.plugins.js");
module.exports = {
  entry: {
    // home: './src/scene/home.js',
    // saveScene: './src/scene/saveScene.js',
    // airTrail: './src/scene/airTrail.js',
    Panorama: './src/scene/Panorama.js',
    MicroScene: './src/scene/MicroScene1.js',
  },
  mode: "development",
  plugins: pluginsConfig,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              ["@babel/plugin-proposal-class-properties", { "loose": true }],
            ]
          }
        }
      }
    ]
  },
  devServer: {
    host: 'localhost',
    port: '8032',
    disableHostCheck: true, // 取消host检查
  },
  resolve: {
    extensions: ['.js'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'three')
  }
};