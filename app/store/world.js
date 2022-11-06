import clone from 'just-clone'
import { defineStore } from 'pinia'
import router from '../router'

import variables from '~root/game/variables'
import functions from '~root/game/functions'

let world
export default ({ pluginVariables, pluginFunctions } = {}) => {
  if (!world) {
    world = defineStore({
      id: 'world',

      state: () => {
        return {
          ...pluginVariables,
          ...clone(variables)
        }
      },

      actions: {
        DEBUG: () => {
          return JSON.parse(JSON.stringify({ ...window.$world, _p: undefined }))
        },
        NEW_GAME () {
          this.$patch(clone(variables))
          window.$story.newGame()
        },
        GOTO (...args) {
          console.log('Goto:', ...args)
          window.$story.goto(...args)
        },
        VIEW (view) {
          router.push(view)
        },
        ...pluginFunctions,
        ...functions
      }
    })()
  }
  return world
}
