<template lang="pug">
.spinner.normflex
  slot(:color="color")
</template>

<script>
export default {
  data() {
    return {
      color: getComputedStyle(document.body).getPropertyValue('--font-color')
    }
  },
  computed: {
    theme() {
      return this.$colorMode.value
    }
  },
  watch: {
    theme() {
      this.color = getComputedStyle(document.body).getPropertyValue(
        '--font-color'
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.spinner {
  height: 33vh;
}
</style>
