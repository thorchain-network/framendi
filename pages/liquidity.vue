<template lang="pug">
.main
  Stream
  .header
    .topbar
      .menu-left
        MenuButtonNavigation
        MenuButtonContact
        MenuButtonTheme
        MenuButtonFormat
        MenuButtonUSD
        MenuButtonSave
        MenuButtonPower

      .middle

      .menu-right
        MenuGroupAlert
        MenuGroupInfo
        MenuGroupPrice

  LiquidityBase
</template>

<script>
export default {
  beforeCreate() {
    this.$store.dispatch('stream/setChannel', 'pools')
  }
}
</script>
