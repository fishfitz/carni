/* eslint-disable no-eval, no-new-func */

export default new Function('world', 'code', `
  console.log('Reading', code)
  with (world) {
    return eval(\`\${code}\`)
  }
`)
