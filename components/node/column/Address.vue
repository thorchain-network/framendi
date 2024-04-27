<template lang="pug">
.tix.left
  a(
    v-tooltip="row.node_address"
    @click="copyToClipboard('Node address', row.node_address)"
  ) {{ row.combo[formraw] }}
  span.node-tools
    a(
      v-tooltip="'THORNode API'"
      :href="row.refer.api"
      target="_blank"
      rel="noopener noreferrer"
    ): IconApi.sfs
    a(
      v-tooltip="'Explore node'"
      :href="row.refer.explorer"
      target="_blank"
      rel="noopener noreferrer"
    ): IconExplorer.sfs
    a(
      v-tooltip="row.ip_issue?.tooltip ?? row.ip_address"
      :class="row.ip_issue?.class"
      @click="clickServer(row)"
    ): IconServer.sfs
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  methods: {
    clickServer(row) {
      if (row.ip_issue?.type === 'NIP') return
      this.copyToClipboard('IP address', row.ip_address)
    }
  }
}
</script>

<style lang="scss" scoped>
.node-tools {
  a {
    padding-left: 3px;

    &.forbidden-pointer:hover {
      cursor: not-allowed;
    }
  }
}
</style>
