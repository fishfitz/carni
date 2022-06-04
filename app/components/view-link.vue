<template>
  <router-link :to="{ name: to }">
    <slot/>
  </router-link>
</template>

<script>
export default {
  props: ['to']
}
</script>
