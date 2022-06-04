const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = ({ mode, projectRoot, carniConfig }) => {
  const config = {
    entry: path.resolve(__dirname, '../app/index.js'),
    module: {
      rules: [
        { test: /\.ni$/, use: [{ loader: path.resolve(__dirname, './sceneLoader.js') }] },
        { test: /\.vue$/, use: [{ loader: require.resolve('vue-loader') }] }
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
