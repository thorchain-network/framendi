<template lang="pug">
.wrapper
  .icon-filler: IconCoinTHORCHAIN
  .filler {{ $store.state.controls.raw ? lastblock.raw : lastblock.fmt }}
</template>

<script>
import { formatNumber } from '~/helpers/functions'
export default {
  computed: {
    lastblock() {
      return formatNumber(this.$store.getters.network.current.lastblock)
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
}

.icon-filler {
  display: flex;
  align-items: center;
  margin-left: auto;
}
</style>
