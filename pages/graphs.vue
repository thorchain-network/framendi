<template lang="pug">
.main
  Stream
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
      MenuGroupChurn
      MenuGroupBond
      MenuGroupPrice

  .graph-window
    .graph-tools
      button.btn.btn-default.btn-ghost(
        v-tooltip="'Node Distribution'"
        @click="component = 'GraphNodeDistribution'"
      ): IconDiagram

    .graph-content
      keep-alive
        component(:is="component")
</template>

<script>
export default {
  data() {
    return {
      component: 'GraphNodeDistribution'
    }
  },
  beforeCreate() {
    this.$store.dispatch('stream/setChannel', 'nodes')
  }
}
</script>

<style lang="scss" scoped>
.graph-window {
  z-index: 100;
  position: fixed;
  top: 70px;
  left: 26px;
  right: 26px;
  background-color: var(--background-color);
  border: 1px solid var(--font-color);
  padding: 26px;
  height: 90vh;
  max-height: 100%;
  max-width: 100%;
  overflow: auto;
}

.btn {
  border: 1px solid var(--font-color);
}

.exit {
  margin-left: auto !important;
}

.graph-tools {
  display: flex;
  width: 100%;
  margin-bottom: 13px;
}

.graph-content {
  height: 90%;
  width: 100%;
}
</style>
