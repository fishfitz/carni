import { createApp, h } from 'vue'

import { RouterView } from 'vue-router'

import router from './router'
import importComponents from './components'
import './store/game'
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
app.use(router)
app.mount('body')

export default () => {}
