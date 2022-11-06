import clone from 'just-clone'
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
          const line = this.scenes[this.sceneId]?.lines[this.lineIndex] || {}
          return {
            ...line,
            text: line.text ? render(line.text, this.$world) : undefined,
            speaker: line.speaker ? { id: line.speaker, ...speakers[line.speaker] } : undefined,
            choices: line.choices ? line.choices.map(c => ({ ...c, text: render(c.text, this.$world) })) : undefined
          }
        }
      },

      actions: {
        DEBUG: () => {
          return JSON.parse(JSON.stringify({ ...window.$story, $world: undefined, scenes: undefined, _p: undefined }))
        },
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
          }
          this.updateJournal()
        },
        pickChoice (choice) {
          this.journal.push({ text: choice.text, type: 'choice' })
          this.goto(choice.scene, choice.line)
        },
        updateJournal () {
          if (this.line.type !== 'text') return
          this.journal.push(clone(this.line))
        },
        speak (text, nextSceneId, nextLineIndex) {
          const oldSceneId = this.sceneId
          const oldLineIndex = this.lineIndex

          this.sceneId = '__speak__'
          this.lineIndex = 0
          this.scenes.__speak__ = {
            id: '__speak__',
            lines: [{
              type: 'text',
              text
            }]
          }

          return new Promise((resolve) => {
            this.scenes.__speak__.lines.push({
              type: 'code',
              code: () => {
                this.goto(nextSceneId ?? oldSceneId, nextLineIndex ?? oldLineIndex + 1)
                resolve()
              }
            })
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
