<template>
  <a :tabindex="disabled ? -1 : 0" aria-roledescription=" " v-bind="$props" ref="element" class="__action__">
    <slot/>
  </a>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  autofocus: Boolean,
  disabled: Boolean
})

const element = ref()

if (props.autofocus) {
  onMounted(() => {
    if (document.activeElement) document.activeElement.blur()
    element.value.focus()
  })
}
</script>

<style lang="scss" scoped>
.__action__ {
  &:focus-visible {
    outline: none;
  }

  &:focus {
    border: 1px solid red;
  }
}
</style>
