import { defineStore } from 'pinia'
import screenfull from 'screenfull'

const getTabContext = () => {
  const tabgroups = [...document.querySelectorAll('[tabgroup]')]
  const groups = [...document.querySelectorAll('[tabindex]')]
    .filter(group => !tabgroups.some(ge => ge.contains(group) && !ge.isSameNode(group)))

  groups.push(...tabgroups)

  groups.sort(function (a, b) {
    if (a === b) return 0
    if (a.compareDocumentPosition(b) & 2) return 1
    return -1
  })

  let activeGroupIndex = -1
  let activeElementIndex
  let keepColumn

  groups.forEach((group, groupIndex) => {
    const elements = []

    if (group.hasAttribute('tabindex')) elements.push(group)
    elements.push(...group.querySelectorAll('[tabindex]'))

    elements.forEach((element, elementIndex) => {
      if (element.isSameNode(document.activeElement)) {
        activeGroupIndex = groupIndex
        activeElementIndex = elementIndex
        keepColumn = group.hasAttribute('tabkeepcolumn')
      }
    })

    group.elements = elements
  })

  return {
    groups,
    activeGroupIndex,
    activeElementIndex,
    keepColumn
  }
}

const firstElementToFocus = ({ group, activeElementIndex, keepColumn }) => {
  if (keepColumn && group.elements[activeElementIndex]) return activeElementIndex
  if (group.hasAttribute('tabstartlast') && group.elements.length) return group.elements.length - 1
  return 0
}

let ui
export default () => {
  if (!ui) {
    ui = defineStore({
      id: 'ui',

      state: () => ({
        isFullscreen: screenfull.isFullscreen
      }),

      actions: {
        DEBUG: () => {
          console.log(JSON.parse(JSON.stringify({ ...this, $WORLD: undefined, $STORY: undefined })))
        },
        fullscreen () {
          screenfull.request()
          this.isFullscreen = screenfull.isFullscreen
        },
        focus (el) {
          setTimeout(() => {
            if (typeof el === 'string') el = document.querySelector(el)
            el.focus()
          }, 1)
        },
        focusNextGroup () {
          setTimeout(() => {
            const { groups, activeGroupIndex, activeElementIndex, keepColumn } = getTabContext()
            const group = groups[(activeGroupIndex + 1) || 0]
            if (!group) return

            group.elements[firstElementToFocus({ group, activeElementIndex, keepColumn })]?.focus()
          }, 1)
        },
        focusPreviousGroup () {
          setTimeout(() => {
            const { groups, activeGroupIndex, activeElementIndex, keepColumn } = getTabContext()
            const group = groups[(activeGroupIndex - 1) || 0]
            if (!group) return

            group.elements[firstElementToFocus({ group, activeElementIndex, keepColumn })]?.focus()
          }, 1)
        },
        focusNextElementInGroup () {
          setTimeout(() => {
            const { groups, activeGroupIndex, activeElementIndex } = getTabContext()
            const group = groups[activeGroupIndex || 0]
            if (!group) return

            group.elements[(activeElementIndex + 1) || 0]?.focus()
          }, 1)
        },
        focusPreviousElementInGroup () {
          setTimeout(() => {
            const { groups, activeGroupIndex, activeElementIndex } = getTabContext()
            const group = groups[activeGroupIndex || 0]
            if (!group) return

            group.elements[(activeElementIndex - 1) || 0]?.focus()
          }, 1)
        }
      }
    })()
  }
  return ui
}
