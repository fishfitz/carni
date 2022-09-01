import { createPinia } from 'pinia'
import story from './story'
import world from './world'
import ui from './ui'

export default (app, { pluginFunctions, pluginVariables }) => {
  app.use(createPinia())

  const worldInstance = world({ pluginFunctions, pluginVariables })
  app.config.globalProperties.$world = worldInstance

  const storyInstance = story()
  storyInstance.updateJournal()
  storyInstance.resolve()
  app.config.globalProperties.$story = storyInstance

  const uiInstance = ui()
  app.config.globalProperties.$ui = uiInstance
}
