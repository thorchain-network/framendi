<template lang="pug">
.vault.normflex(
  :style="{ color: colorizeVault(row.vault.color) }"
  v-tooltip="row.vault.fmt"
  @click="copyToClipboard('Vault address', row.vault.raw)"
  @mouseover="hover = true"
  @mouseleave="hover = false"
)
  .padded(v-if="$store.state.controls.raw") {{ row.vault.raw }}
  .ctd(v-else)
    IconCircleFilled.circle(v-if="hover")
    IconCircle.circle(v-else)
</template>

<script>
const colors = {
  red: { dark: '#dd6b66', sepia: '#d87c7c', light: '#fb7293' },
  green: { dark: '#91ca8c', sepia: '#919e8b', light: '#9FE6B8' },
  blue: { dark: '#73b9bc', sepia: '#61a0a8', light: '#37A2DA' },
  yellow: { dark: '#eedd78', sepia: '#d7ab82', light: '#FFDB5C' },
  orange: { dark: '#f49f42', sepia: '#cc7e63', light: '#ff9f7f' },
  purple: { dark: '#7289ab', sepia: '#724e58', light: '#9d96f5' }
}

export default {
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      hover: false
    }
  },
  methods: {
    colorizeVault(color) {
      if (!this.net.vaults) return
      return colors[color][this.$colorMode.value]
    }
  }
}
</script>

<style scoped lang="scss">
.vault {
  height: 100%;
}

svg.circle {
  height: 0.66em;
  width: 0.66em;
}

.padded {
  padding: calc(var(--global-space) / 2);
}
</style>
