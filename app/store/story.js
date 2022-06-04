import { defineStore } from 'pinia'

import evalCode from '../utils/eval'
import render from '../utils/render'
import world from './world'

import config from '~root/carni.config'

const scenes = (ctx => ctx.keys().reduce((acc, file, scenes) => {
  return { ...acc, ...ctx.keys().map(ctx)[scenes] }
}, {}))(require.context('~root/game/scenes', true, /\.ni$/))
const speakers = require('~root/game/speakers')

const newGame = {
  sceneId: config.firstScene || 'start',
  lineIndex: 0,
  choices: null,
  journal: [],
  isNewGame: true
}

let story
export default () => {
  if (!story) {
    story = defineStore({
      id: 'story',

      state: () => ({
        scenes,
        $world: world(),
        ...newGame
      }),

      getters: {
        line () {
          return this.scenes[this.sceneId]?.lines[this.lineIndex] || {}
        }
      },

      actions: {
        newGame () {
          this.$patch({ ...newGame })
          this.updateJournal()
        },
        goto (scene, line = 0) {
          this.sceneId = scene
          this.lineIndex = line
          if (this.line.type === 'code') this.resolve()
          else this.updateJournal()
        },
        resolve () {
          const line = this.line
          if (!line) {
            return
          }
          if (line.condition && !evalCode(this.$world, line.condition, true)) {
            this.lineIndex++
            return this.resolve()
          }
          if (line.type === 'code') {
            evalCode(this.$world, line.code)

            if (this.line.type === 'code') {
              this.lineIndex++
              return this.resolve()
            }
          } else if (line.type === 'choice') this.choices = line.choices
          this.updateJournal()
        },
        pickChoice (choice) {
          this.choices = null
          this.journal.push({ text: choice.text, type: 'choice' })
          this.goto(choice.scene, choice.line)
        },
        updateJournal () {
          if (this.line.type !== 'text') return

          this.journal.push({
            ...this.line,
            text: this.line.text ? render(this.line.text, this.$world) : undefined,
            speaker: this.line.speaker ? { id: this.line.speaker, ...speakers[this.line.speaker] } : undefined
          })
        },
        next () {
          if (this.line.type === 'text') {
            this.isNewGame = false
            this.lineIndex++
            this.resolve()
          }
        }
      }
    })()
  }
  return story
}
