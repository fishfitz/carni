/* eslint-disable no-eval, no-new-func */

export default new Function('world', 'code', 'addReturn', `
  with (world) {
    return eval(\`\${addReturn ? 'return' : ''} \${code}\`);
  }
`)
