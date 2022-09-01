const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = ({ mode, projectRoot, carniConfig }) => {
  const config = {
    entry: path.resolve(__dirname, '../app/index.js'),
    module: {
      rules: [
        { test: /\.ni$/, use: [{ loader: path.resolve(__dirname, './sceneLoader.js') }] },
        { test: /\.vue$/, use: [{ loader: require.resolve('vue-loader') }] },
        { test: /\.(mp3|png|jpg|gif|woff|woff2|eot|ttf|svg)$/, type: 'asset' },
        { test: /\.css$/i, use: ['vue-style-loader', 'css-loader'] },
        { test: /\.s[ac]ss$/i, use: ['vue-style-loader', 'css-loader', 'sass-loader'] }
      ]
    },
    resolve: {
      alias: {
        '~root': projectRoot,
        vue: require.resolve(`vue/dist/vue.esm-browser${mode === 'prod' ? '.prod' : ''}.js`)
      }
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        title: carniConfig.title
      })
    ]
  }

  if (mode === 'prod') {
    config.plugins.push(new webpack.DefinePlugin({
      __VUE_PROD_DEVTOOLS__: false
    }))

    return {
      name: 'prod',
      mode: 'production',
      output: {
        path: path.join(projectRoot, 'dist'),
        filename: 'script.js'
      },
      ...config
    }
  }

  return {
    name: 'dev',
    mode: 'development',
    ...config
  }
}
