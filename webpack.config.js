module.exports = {
  entry: "./lib/mini-lennium_falcon.js",
  output: {
  	filename: "./lib/bundle.js"
  },
  devtool: 'source-map',
  resolve: {
    extensions: ["", ".js"]
  }
};
