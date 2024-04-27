<template lang="pug">
.site-alert.normflex.red-class(v-if="showAlerts")
  .triangle: IconAlert
  .alert-msg(
    v-if="outdated"
    v-tooltip="'Please reload to ensure the update takes effect'"
  ) UPDATE
  .alert-msg(v-if="stale.active && staleThreshold" v-tooltip="stale.tooltip") STALE
  .alert-msg(v-if="net.mimir?.HALTTHORCHAIN" v-tooltip="'THORChain Paused'") THORCHAIN
  .alert-msg(v-if="net.mimir?.HALTCHAINGLOBAL" v-tooltip="'Chains Paused'") CHAINS
  .alert-msg(
    v-if="net.mimir?.NODEPAUSECHAINGLOBAL > net.lastblock"
    v-tooltip="'Chains Paused - Remaining Time/Blocks'"
  )
    .node-pause
      .msg NODE PAUSE
      .eta
        .detail {{ nodePauseETA.remainingTime }}
        .detail {{ nFmt(nodePauseETA.remainingBlocks) }}
  .alert-msg(v-if="net.mimir?.HALTTRADING" v-tooltip="'Trading Paused'") TRADING
  .alert-msg(v-if="net.mimir?.HALTSIGNING" v-tooltip="'Signing Paused'") SIGNING
</template>

<script>
import { humanizeDuration } from '~/helpers/functions'
const semver = require('semver')

export default {
  computed: {
    staleThreshold() {
      return this.net.tip < -10
    },
    outdated() {
      return semver.gt(this.net.server, this.$store.state.networks.version)
    },
    nodePauseETA() {
      const remainingBlocks =
        this.net.mimir?.NODEPAUSECHAINGLOBAL - this.net.lastblock
      return {
        remainingBlocks,
        remainingTime: humanizeDuration(
          remainingBlocks * this.net.blocktime * 1000,
          { round: true, largest: 1, spacer: '' }
        )
      }
    },
    showAlerts() {
      return (
        this.outdated ||
        this.staleThreshold ||
        this.net.mimir?.HALTTHORCHAIN ||
        this.net.mimir?.HALTCHAINGLOBAL ||
        this.net.mimir?.NODEPAUSECHAINGLOBAL > this.net.lastblock ||
        this.net.mimir?.HALTTRADING ||
        this.net.mimir?.HALTSIGNING
      )
    },
    stale() {
      const pluralizedBlock = Math.abs(this.net.tip) === 1 ? 'Block' : 'Blocks'
      return {
        active: this.net.tip,
        tooltip: `App ${this.net.tip} ${pluralizedBlock} Behind Tip`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.site-alert {
  align-items: flex-end;
  line-height: 0;
  font-weight: bold;

  .triangle {
    display: flex;
    align-items: center;
    height: 100%;
  }
}

.alert-msg {
  padding: 0 5px;
  cursor: default;
  padding: 0;
  height: 100%;
  display: flex;
  align-items: center;

  .node-pause {
    display: flex;
    flex-direction: row;
    align-items: center;

    .eta {
      line-height: 1.25;
      margin-left: 10px;

      .detail {
        white-space: nowrap;
      }
    }
  }
}
</style>
