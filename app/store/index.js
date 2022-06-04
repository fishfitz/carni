import { createPinia } from 'pinia'
import story from './story'
import world from './world'
import ui from './ui'

export default (app) => {
  app.use(createPinia())

  const storyInstance = story()
  storyInstance.updateJournal()
  storyInstance.resolve()
  app.config.globalProperties.$story = storyInstance

  const worldInstance = world()
  app.config.globalProperties.$world = worldInstance

  const uiInstance = ui()
  app.config.globalProperties.$ui = uiInstance
}
