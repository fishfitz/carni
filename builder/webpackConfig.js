const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = ({ mode, projectRoot, carniConfig }) => {
  const config = {
    entry: path.resolve(__dirname, '../app/index.js'),
    module: {
      rules: [
        {
          test: /\.ni$/,
          use: [{ loader: path.resolve(__dirname, './sceneLoader.js') }]
        },
        {
          test: /\.vue$/,
          use: [{
            loader: require.resolve('vue-loader'),
            options: {
              reactivityTransform: true
            }
          }]
        },
        {
          test: /\.(mp3|png|jpg|gif|woff|woff2|eot|ttf|svg)$/,
          type: 'asset'
        },
        {
          test: /\.bms/,
          type: 'asset/source'
        },
        {
          test: /\.css$/i,
          use: [
            require.resolve('vue-style-loader'),
            require.resolve('css-loader')
          ]
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            require.resolve('vue-style-loader'),
            require.resolve('css-loader'),
            require.resolve('sass-loader')
          ]
        }
      ]
    },
    resolve: {
      alias: {
        '~root': projectRoot,
        '~carni/render': require.resolve('../app/utils/render'),
        vue: require.resolve(`vue/dist/vue.esm-browser${mode === 'prod' ? '.prod' : ''}.js`)
      }
    },
    plugins: [
      new VueLoaderPlugin(),
      require('unplugin-auto-import/webpack')({
        imports: ['vue']
      }),
      new HtmlWebpackPlugin({
        title: carniConfig.title
      }),
      new webpack.DefinePlugin({
        __BUILD_MODE__: JSON.stringify(mode),
        'process.env.NODE_ENV': JSON.stringify(mode === 'prod' ? 'production' : 'development'),
        'process.env.NODE_DEBUG': false
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
