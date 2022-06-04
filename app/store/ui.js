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
        fullscreen () {
          screenfull.request()
          this.isFullscreen = screenfull.isFullscreen
        }
      }
    })()
  }
  return ui
}
