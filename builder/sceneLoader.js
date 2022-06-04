const keys = {}

module.exports = function (source) {
  const file = this._module.resource
  Object.keys(keys).forEach(k => {
    if (keys[k] === file) delete keys[k]
  })

  return `module.exports = ${JSON.stringify(Object.fromEntries(source
  .split(/^#/m)
  .map((s) => s.trim())
  .filter((s) => s)
  .map((scene) => {
    let lines = scene.split('\n').map((l) => l.trim()).filter((b) => b)
    const id = lines.shift().replace('#', '')
    lines = lines
      .map((line) => {
        if (line.slice(0, 2) === '//') return null

        let condition = line.match(/^\?(.+)\?/)
        if (condition) {
          line = line.replace(condition[0], '').trim()
          condition = condition[1].trim()
        }

        if (line[0] === '$') return { condition, type: 'code', code: line.slice(1).trim() }
        if (line.slice(0, 3) === '>>>') {
          const scene = line.slice(3)
          return {
            condition,
            type: 'code',
            code: `GOTO('${scene.split(',')[0] || id}', ${scene.split(',')[1]})`
          }
        }
        if (line.slice(0, 2) === '>>') {
          const scenes = line.match(/>>\S+/g)
          return {
            condition,
            type: 'choice',
            choices: line
              .split(/>>\S+/)
              .filter((a) => a)
              .map((text, i) => ({
                text: text.trim(),
                scene: scenes[i].replace('>>', '').split(',')[0] || id,
                line: scenes[i].split(',')[1]
              }))
          }
        }

        let speaker = null
        let mood = null
        if (line.search(/^\S+:/) !== -1) ([speaker, mood] = line.toLowerCase().match(/^\S+:/)[0].replace(':', '').trim().split(','))
        return {
          condition,
          speaker,
          mood,
          type: 'text',
          text: line.replace(/^\S+:/, '').trim()
        }
      })
      .filter((l) => l)

    if (keys[id]) throw new Error(`Duplicated scene key found: #${id} in file ${file}. Scene keys must be unique.`)
    keys[id] = file

    return [id, { id, lines }]
  })))}`
}
