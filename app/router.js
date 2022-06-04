import { createRouter, createMemoryHistory } from 'vue-router'

export default createRouter({
  history: createMemoryHistory(),
  routes: (ctx => ctx.keys().reduce((acc, route, component) => {
    const name = route.replace(/^\.\//, '').replace(/\.vue$/, '')
    return [...acc, {
      name,
      path: `/${name}`,
      component: ctx.keys().map(ctx)[component].default
    }]
  }, []))(require.context('~root/views', true, /\.vue$/))
})
