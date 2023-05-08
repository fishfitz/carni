<template>
  <span
    v-bind="$props"
    ref="element"
    class="__action__"
  >
    <slot/>
  </span>
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
  display: inline-block;
  box-sizing: border-box;

  &:focus-visible {
    outline: none;
  }

  &:focus {
    border: 10px solid red;
  }
}
</style>
