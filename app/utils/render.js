import * as squirrelly from 'squirrelly'

squirrelly.defaultConfig.autoEscape = false

export default (text, world) => squirrelly.render(text, world, { useWith: true })
