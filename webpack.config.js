module.exports = {
  entry: "./lib/mini-lennium_falcon.js",
  output: {
  	filename: "./lib/bundle.js"
  },
  module: {
    loaders: [
      {
        test: [/\.js?$/],
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  devtool: 'source-map',
  resolve: {
    extensions: ["",".js"]
  }
};
