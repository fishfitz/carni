<template>
  <router-link :to="{ name: to }" tabindex="0" aria-roledescription=" ">
    <slot/>
  </router-link>
</template>

<script>
export default {
  props: ['to']
}
</script>
