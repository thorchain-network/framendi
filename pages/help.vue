<template lang="pug">
.main
  .topbar
    .menu-left
      MenuButtonNavigation
      MenuButtonContact
      MenuButtonTheme

    .middle

    .menu-right
      MenuGroupAlert
      MenuGroupInfo
      MenuGroupChurn
      MenuGroupBond
      MenuGroupPrice

  .frame
    .column
      h2 NAVIGATION CONTROLS
      .content
        .row(v-for="(value, key) in appNavigation" :key="key")
          .cell.key: .simbut {{ value.key }}
          .cell {{ value.desc }}

    .column
      h2 TOOL CONTROLS
      .content
        .row
          .cell.key: .simbut M
          .cell Cycle Themes
        .row
          .cell.key: .simbut P
          .cell Toggle Stream
        .row
          .cell.key: .simbut C
          .cell Toggle Chain Probes
        .row
          .cell.key: .simbut I
          .cell Toggle Columns - Location
        .row
          .cell.key: .simbut K
          .cell Toggle Columns - Chains
        .row
          .cell.key: .simbut O
          .cell Toggle Formatting
        .row
          .cell.key: .simbut T
          .cell Toggle USD Denomination
        .row
          .cell.key: .simbut Q
          .cell Save State
        .row
          .cell.key: .simbut F
          .cell Focus Search
        .row
          .cell.key: .simbut X
          .cell Clear Search
        .row
          .cell.key: .simbut R
          .cell Refresh
        .row
          .cell.key: .simbut ESC
          .cell Exit (Search, Overlays, ...)

    .column
      h2 FONT CONTROLS
      .content
        .row
          .set-font-o
            input(
              type="text"
              ref="font"
              v-model="font"
              @keydown="setKeyboardControls(false)"
              @blur="setKeyboardControls(true)"
            )
        .row
          .set-font
            .btn-group.menu-right
              button.btn.btn-default.btn-ghost(@click="setFont(font)") SAVE
              button.btn.btn-default.btn-ghost(@click="setFont(fonts.default)") DEFAULT
              button.btn.btn-default.btn-ghost(@click="setFont(fonts.system)") SYSTEM
      .hr
      h2 STATE CONTROLS
      .content
        .row
          button.btn.btn-default.btn-ghost(@click="resetApplication") RESET APPLICATION
      .hr
      h2.upcase APP {{ displayTip }}
      .content
        .row
          .cell Framendi
          .cell {{ $store.state.networks.version }}
        .row
          .cell Ölgerð
          .cell {{ net.server }}
</template>

<script>
export default {
  data() {
    return {
      font: ''
    }
  },
  computed: {
    fonts() {
      return {
        default: 'Runic, Monoid',
        system:
          'menlo, monaco, lucida console, liberation mono, dejavu sans mono, bitstream vera sans mono, courier new, monospace, serif'
      }
    },
    displayTip() {
      const blockState = Math.abs(this.net.tip)
      const pluralizedBlock = blockState === 1 ? 'block' : 'blocks'
      return this.net.tip < 0
        ? `${blockState} ${pluralizedBlock} behind`
        : `${blockState} ${pluralizedBlock} ahead`
    }
  },
  mounted() {
    this.font = this.$store.state.controls.font
  },
  methods: {
    setKeyboardControls(val) {
      this.$store.dispatch('controls/setKeyboardControls', val)
    },
    setFont(val) {
      this.$store.dispatch('controls/setFont', val)
      this.font = val
    },
    resetApplication() {
      localStorage.clear()
      location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
.set-font {
  .btn {
    width: 120px;
    border-top: 0;
  }
}

.key {
  padding: 1px !important;

  &:first-child {
    padding-right: 9px !important;
  }
}

.content {
  .cell {
    text-align: left !important;
  }
}

.simbut {
  border: 1px solid var(--font-color);
  text-align: center;
  padding: 4px 8px;
  min-width: 45px;
}
</style>
