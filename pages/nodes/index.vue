<template lang="pug">
.main
  Stream
  .header
    .topbar
      .menu-left
        MenuButtonNavigation
        MenuButtonContact
        MenuButtonTheme
        MenuButtonColumn
        MenuButtonProbes
        MenuButtonFormat
        MenuButtonUSD
        MenuButtonSave
        MenuButtonPower

      .middle

      .menu-right
        MenuGroupAlert
        MenuGroupInfo
        MenuGroupChurn
        MenuGroupBond
        MenuGroupPrice

  NodeBase
</template>

<script>
export default {
  beforeCreate() {
    this.$store.dispatch('stream/setChannel', 'nodes')
  }
}
</script>
