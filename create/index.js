const sao = require('sao')

module.exports = (target) => {
  sao({
    generator: 'fishfitz/carni-template',
    outDir: target || '.',
    npmClient: 'npm'
  })
    .run()
    .catch((err) => {
      console.trace(err)
      process.exit(1)
    })
}
