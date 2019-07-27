const path = require("path");

const config = {
  devtool: 'source-map',
  entry: {
    main: "./src/index.js",
    authorization: "./src/authorization/index.js"
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      }
    ]
  }
};

module.exports = config;
