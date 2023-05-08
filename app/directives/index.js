export default (app) => {
  app.directive('tab', {
    created (el, { value }) {
      el.setAttribute('tabindex', value || 0)
      el.setAttribute('aria-roledescription', ' ')
      el.setAttribute('role', 'menuitem')
    }
  })

  app.directive('focus', {
    mounted: (el) => el.focus()
  })
}
