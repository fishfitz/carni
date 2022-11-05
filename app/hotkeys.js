import hotkeys from 'hotkeys-js'
import gameHotkeys from '~root/game/hotkeys'
import world from './store/world'

export default () => {
  Object.entries(gameHotkeys).forEach(([key, handler]) => {
    hotkeys('*', () => {
    })
    hotkeys(key, event => {
      console.info('Hotkey:', key)
      event.preventDefault()
      handler(world())
    })
  })
}
