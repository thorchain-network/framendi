<template lang="pug">
button#btn-format.buitoni(
  v-tooltip="'Toggle RAW Format'"
  @click="toggleFormat"
  :class="{ active: this.$store.state.controls.raw }"
)
  IconRaw
  GlobalEvents(v-if="keyboardControlsActive" @keyup.79="toggleFormat")
</template>

<script>
export default {
  methods: {
    toggleFormat() {
      this.$store.dispatch('controls/toggleFormat')
    }
  }
}
</script>
