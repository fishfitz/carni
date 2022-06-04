import { createApp, h } from 'vue'

import { RouterView } from 'vue-router'

import router from './router'
import importComponents from './components'
import importStore from './store'
import importHotkeys from './hotkeys'
import config from '~root/carni.config'

const app = createApp({
  components: { RouterView },
  created () {
    this.$router.replace({ name: config.firstView })
  },
  render () {
    return h(RouterView)
  }
})

importComponents(app)
importStore(app)
importHotkeys()

app.use(router)
app.mount('body')

export default () => {}
