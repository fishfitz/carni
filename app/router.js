/* global __BUILD_MODE__ */

import { createRouter, createWebHashHistory, createMemoryHistory } from 'vue-router'

export default createRouter({
  history: __BUILD_MODE__ === 'prod' ? createMemoryHistory() : createWebHashHistory(),
  routes: (ctx => ctx.keys().reduce((acc, route, component) => {
    const name = route.replace(/^\.\//, '').replace(/\.vue$/, '')
    return [...acc, {
      name,
      path: `/${name}`,
      component: ctx.keys().map(ctx)[component].default
    }]
  }, []))(require.context('~root/game/views', true, /\.vue$/))
})
