import { createApp, h } from 'vue'

import router from './router'
import importComponents from './components'
import importStore from './store'
import importHotkeys from './hotkeys'

import config from '~root/carni.config'
import appView from '~root/game/app.vue'

const pluginFunctions = {}
const pluginVariables = {}
const pluginSetup = []

config.plugins?.forEach((plugin) => {
  if (plugin.default) plugin = plugin.default
  const pluginData = plugin()
  const { setup = () => {}, functions = {}, variables = {} } = pluginData
  Object.assign(pluginFunctions, functions)
  Object.assign(pluginVariables, variables)
  pluginSetup.push((app) => {
    setup(app)
  })
})

const app = createApp({
  created () {
    this.$router.replace({ name: config.firstView })
  },
  render: () => h(appView)
})

importComponents(app)
importStore(app, { pluginFunctions, pluginVariables })
importHotkeys()

app.use(router)

pluginSetup.forEach(f => f(app))

app.mount('body')

export default () => {}
