<template lang="pug">
.filter
  input(
    type="text"
    ref="search"
    v-model="buffer"
    placeholder="Search..."
    @keydown="disableKeyboardControls"
    @blur="setKeyboardControls(true)"
  )
  GlobalEvents(@keyup.27="$refs.search.blur()")
  GlobalEvents(
    v-if="keyboardControlsActive"
    @keyup.70="$refs.search.focus()"
    @keyup.88="clearSearch"
  )
</template>

<script>
import { debounce } from 'lodash'

export default {
  data() {
    return {
      buffer: ''
    }
  },
  watch: {
    buffer: debounce(function (newVal) {
      this.$store.dispatch('updateFilter', newVal)
    }, 500)
  },
  created() {
    this.clearSearch()
  },
  methods: {
    clearSearch() {
      this.$store.dispatch('updateFilter', '')
      this.buffer = ''
    },
    setKeyboardControls(val) {
      this.$store.dispatch('controls/setKeyboardControls', val)
    },
    disableKeyboardControls() {
      if (this.$store.state.controls.keyboardControlsActive)
        this.setKeyboardControls(false)
    }
  }
}
</script>

<style lang="scss" scoped>
.filter {
  input[type='text'] {
    margin-bottom: -1px;
    margin-top: -1px;
  }
}
</style>
