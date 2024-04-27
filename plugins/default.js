import 'normalize.css'

import '~/assets/animate/index.scss'

import Vue from 'vue'

import { hideAllPoppers } from 'floating-vue'

import {
  appNavigation,
  formatNumber,
  formatAndKeepNumber,
  nFmt,
  formatRune,
  explorerUrl
} from '~/helpers/functions'

import NotificationClipboard from '~/components/notification/Clipboard'

if (!Vue.__crstin_mixin__) {
  Vue.__crstin_mixin__ = true
  Vue.mixin({
    computed: {
      appNavigation() {
        return appNavigation
      },
      net() {
        return this.$store.getters.network.current
      },
      rune() {
        return this.$store.state.ticker.rune
      },
      allNodes() {
        return (
          [
            ...this.net.nodes.active,
            ...this.net.nodes.frontline,
            ...this.net.nodes.rest
          ] ?? []
        )
      },
      chainList() {
        return this.net.chains.map((chain) => chain.name)
      },
      chainTips() {
        return this.net.chains.reduce((acc, obj) => {
          acc[obj.name] = obj.max
          return acc
        }, {})
      },
      upcaseNetName() {
        return this.net.name.toUpperCase()
      },
      formraw() {
        return this.$store.state.controls.raw ? 'raw' : 'fmt'
      },
      formusd() {
        return this.$store.state.controls.usd ? 'usd' : 'fmt'
      },
      keyboardControlsActive() {
        return this.$store.state.controls.keyboardControlsActive
      },
      appSection() {
        return this.$route.path.split('/')[1]
      },
      circulatingSupply() {
        return this.net.balances.supply - this.totalReserve - this.totalTreasury
      },
      totalReserve() {
        return (
          Number(this.net.balances.reserve) +
          Number(this.net.balances.standby_reserve)
        )
      },
      totalTreasury() {
        return (
          Number(this.net.balances.treasury_multisig) +
          Number(this.net.balances.treasury_2) +
          Number(this.net.balances.treasury_lp2)
        )
      },
      isProd() {
        return process.env.isProd
      }
    },
    methods: {
      denominate(n, fr = 0, notation = 'standard') {
        return this.formatDenom(this.formatRune(n, fr, notation))
      },
      formatDenom(val) {
        if (!val) return
        if (!this.$store.state.controls.raw && 'usd' in val)
          return val[this.formusd]
        return val[this.formraw]
      },
      formatNumber(n, fr = 0, notation = 'standard', style = 'decimal') {
        return formatNumber(n, fr, notation, style)
      },
      formatAndKeepNumber(
        orig,
        n,
        fr = 0,
        notation = 'standard',
        style = 'decimal'
      ) {
        return formatAndKeepNumber(orig, n, fr, notation, style)
      },
      nFmt(n, fr = 0, notation = 'standard', style = 'decimal') {
        return nFmt(n, fr, notation, style)
      },
      formatRune(n, fr = 0, notation = 'standard') {
        return formatRune(this.rune.bare, n, fr, notation)
      },
      formatAsset(val, decimals = 8, fr = 0) {
        if (Number(val) === 0) return '-'
        return this.formatAndKeepNumber(val, val / Math.pow(10, decimals), fr)[
          this.formraw
        ]
      },
      formatFee(fee) {
        return {
          raw: fee,
          fmt: this.nFmt(fee / 10000, 2, 'standard', 'percent')
        }[this.formraw]
      },
      explorerUrl(addr) {
        return explorerUrl(addr, this.net.name)
      },
      hideAllPoppers() {
        hideAllPoppers()
      },
      copyToClipboard(subject, body) {
        navigator.clipboard.writeText(body)
        this.$toast.success(
          { component: NotificationClipboard, props: { subject, body } },
          { timeout: 2500 }
        )
      },
      pauseStream() {
        const store = this.$store
        store.dispatch('stream/togglePause', store.state.stream.active)
        store.state.stream.active
          ? store.dispatch('stream/stop')
          : store.dispatch('stream/start')
      },
      addVisibilityChangeEventListener() {
        document.addEventListener(
          'visibilitychange',
          this.visibilityChange,
          false
        )
      },
      removeVisibilityChangeEventListener() {
        document.removeEventListener(
          'visibilitychange',
          this.visibilityChange,
          false
        )
      },
      visibilityChange(e) {
        if (this.$store.state.stream.pause) return
        document.hidden
          ? this.$store.dispatch('stream/stop')
          : this.$store.dispatch('stream/start')
      },
      startStream() {
        this.addVisibilityChangeEventListener()
        if (!this.$store.state.stream.pause)
          this.$store.dispatch('stream/start')
      },
      stopStream() {
        this.removeVisibilityChangeEventListener()
        this.$store.dispatch('stream/stop')
      }
    }
  })
}
