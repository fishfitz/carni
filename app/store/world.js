import { defineStore } from 'pinia'
import router from '../router'
import story from './story'
import ui from './ui'

const variables = require('~root/game/variables')
const functions = require('~root/game/functions')

let world
export default ({ pluginVariables, pluginFunctions } = {}) => {
  console.log('...!!!', pluginFunctions)
  if (!world) {
    world = defineStore({
      id: 'world',

      state: () => {
        return {
          ...pluginVariables,
          ...JSON.parse(JSON.stringify(variables)),
          $STORY: story(),
          $UI: ui()
        }
      },

      actions: {
        NEW_GAME () {
          this.$patch(JSON.parse(JSON.stringify(variables)))
          console.log(this.$STORY)
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
