import clone from 'just-clone'
import { defineStore } from 'pinia'
import router from '../router'
import story from './story'
import ui from './ui'

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
          ...clone(variables),
          $STORY: story(),
          $UI: ui()
        }
      },

      actions: {
        NEW_GAME () {
          this.$patch(clone(variables))
          this.$STORY.newGame()
        },
        GOTO (...args) {
          this.$STORY.goto(...args)
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
