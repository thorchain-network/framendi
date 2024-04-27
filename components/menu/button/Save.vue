<template lang="pug">
button#btn-save.buitoni(v-tooltip="'Save State'" @click="saveState")
  IconSave
  GlobalEvents(v-if="keyboardControlsActive" @keyup.81="saveState")
</template>

<script>
export default {
  methods: {
    saveState() {
      this.$store.dispatch('saveState', 'State saved!')
    }
  }
}
</script>
