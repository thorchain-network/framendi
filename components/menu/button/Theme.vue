<template lang="pug">
button#btn-theme.buitoni(
  v-tooltip="{ content: `<div class='vtt-title upcase'>${$colorMode.value}</div><div>Switch Theme</div>`, html: true }"
  @click="cycleTheme"
)
  IconTheme
  GlobalEvents(v-if="keyboardControlsActive" @keyup.77="cycleTheme")
</template>

<script>
export default {
  methods: {
    cycleTheme() {
      this.$store.dispatch('controls/cycleTheme')
    }
  }
}
</script>
