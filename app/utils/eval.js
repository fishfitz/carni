/* eslint-disable no-eval, no-new-func */

export default (world, code) => typeof code === 'function'
  ? code()
  : new Function('world', 'code', `
    console.log('Reading', code)
    with (world) {
      return eval(\`\${code}\`)
    }
  `)(world, code)
