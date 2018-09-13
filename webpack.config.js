const path = require('path'),
  CleanWebpackPlugin = require('clean-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  webpack = require('webpack');

  const ExtractTextPlugin = require('extract-text-webpack-plugin');

  const extractPlugin = new ExtractTextPlugin({
    filename: 'assets/css/app.css'
  })

  const config = {
  context: path.resolve(__dirname, 'src'),
  devServer: {
    compress: true,
    contentBase: path.resolve(__dirname, 'dist/assets/img'),
    open: false,
    port: 3000,
    stats: 'normal',
  },
  devtool: 'inline-source-map',
  entry: {
    app: './assets/js/app.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/, // to let the loader know which file format it’s going to work on
        include: /src/, // to let the loader know which directory it should work into
        exclude: /node_modules/, // to let the loader know which directory should it avoid while parsing
        use: { //  to let the loader know which specific loader it’s using with use.loader and what’s it’s configuration options with use.options
          loader: "babel-loader",
          options: {
            presets: ['env']
          }
        }
      },
      {
        test: /\.(scss|css)$/,
        include: [path.resolve(__dirname, 'src', 'assets', 'scss')],
        use: extractPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader','sass-loader'],
          publicPath: '../../'
        })
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
				test:/\.(jpg|png|jpeg|gif|svg|map)$/,
				use: [
						{
							loader: 'file-loader',
							options: {
								name: '[hash:14].[ext]',
								outputPath: 'assets/img/'
							}
						}
					]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader?name=assets/fonts/[name].[ext]']
      }
    ]
  },
  output: {
    filename: './assets/js/[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    extractPlugin,
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'GeeksMotion Template',
      filename: 'index.html',
      template: 'index.html',
      inject: false
    }),
    new HtmlWebpackPlugin({
      filename: 'page.html',
      template: 'page.html',
      inject: false,
      chuncks:[]
    })
  ],
};

module.exports = config;
