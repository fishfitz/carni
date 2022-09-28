import { defineStore } from 'pinia'
import screenfull from 'screenfull'

let ui
export default () => {
  if (!ui) {
    ui = defineStore({
      id: 'ui',

      state: () => ({
        isFullscreen: screenfull.isFullscreen
      }),

      actions: {
        DEBUG: () => {
          console.log(JSON.parse(JSON.stringify({ ...this, $WORLD: undefined, $STORY: undefined })))
        },
        fullscreen () {
          screenfull.request()
          this.isFullscreen = screenfull.isFullscreen
        },
        focus (el) {
          setTimeout(() => {
            if (typeof el === 'string') el = document.querySelector(el)
            el.focus()
          }, 1)
        }
      }
    })()
  }
  return ui
}
