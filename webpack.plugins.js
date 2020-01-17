const webpack = require("webpack")
const path = require('path')
const htmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const UglifyjsWebpackPlugin = require("uglifyjs-webpack-plugin")
const CopyPlugin = require('copy-webpack-plugin')

module.exports = [
  new webpack.HotModuleReplacementPlugin(),
  // 调用之前先清除 map 文件夹
  new CleanWebpackPlugin(),
  // 4.x之前可用uglifyjs-webpack-plugin用以压缩文件，4.x可用--mode更改模式为production来压缩文件
  new UglifyjsWebpackPlugin(),
  new CopyPlugin([{
    from: path.resolve(__dirname, "src/assets"),
    to: './static'
  }]),
  // 自动生成html模板
  // new htmlWebpackPlugin({
  //   filename: "home.html",
  //   title: "home",
  //   chunks: ['home'],
  //   template: "./src/views/home.html"
  // }),
  new htmlWebpackPlugin({
    filename: "保存场景或模型.html",
    title: "saveScene",
    chunks: ['saveScene'],
    template: "./src/views/saveScene.html"
  }),
  new htmlWebpackPlugin({
    filename: "按照轨迹飞行.html",
    title: "airTrail",
    chunks: ['airTrail'],
    template: "./src/views/airTrail.html"
  }),
  new htmlWebpackPlugin({
    filename: "全景图.html",
    title: "Panorama",
    chunks: ['Panorama'],
    template: "./src/views/Panorama.html"
  }),
  new htmlWebpackPlugin({
    filename: "MicroScene1.html",
    title: "MicroScene",
    chunks: ['MicroScene'],
    template: "./src/views/MicroScene1.html"
  }),
  new htmlWebpackPlugin({
    filename: "houseDesign.html",
    title: "houseDesign",
    chunks: ['houseDesign'],
    template: "./src/views/houseDesign.html"
  }),
  new htmlWebpackPlugin({
    filename: "flyLine.html",
    title: "flyLine",
    chunks: ['flyline'],
    template: "./src/views/flyLine.html"
  }),
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
    "window.jQuery": "jquery"
  })
]