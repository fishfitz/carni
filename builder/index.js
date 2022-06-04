const path = require('path')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const generateConfig = require('./webpackConfig')

module.exports = async (mode, projectRoot) => {
  let config
  try {
    config = require(path.join(projectRoot, 'carni.config.js'))
  } catch (e) {
    console.error('FATAL: Unable to read carni.config.js file.', e)
    process.exit(1)
  }

  const webpackConfig = generateConfig({ mode, projectRoot, carniConfig: config })

  if (mode === 'dev') {
    const server = new WebpackDevServer({ ...webpackConfig.devServer, open: true }, webpack(webpackConfig))
    await server.start()
  } else if (mode === 'prod') {
    try {
      await new Promise((resolve, reject) => {
        webpack(webpackConfig, (err, stats) => {
          if (err || stats.hasErrors()) reject(err || stats.toString('minimal'))
          else resolve()
        })
      })
    } catch (e) {
      console.error('FATAL: Error during build.', e)
      process.exit(1)
    }
  }
}
