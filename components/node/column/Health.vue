<template lang="pug">
.tix
  span(v-if="row.ip_issue" v-tooltip="row.ip_issue?.info") {{ row.ip_issue?.type }}
  template(v-else)
    a.expand-link(
      v-if="isField('rpc')"
      :class="classFn('rpc')"
      :href="`http://${row.ip_address}:27147/health?`"
      v-tooltip="'Check RPC health'"
      target="_blank"
      rel="noopener noreferrer"
    ) {{ format(row.health?.rpc) }}

    a.expand-link(
      v-if="isField('bfr')"
      :class="classFn('bfr')"
      :href="`http://${row.ip_address}:6040/p2pid`"
      v-tooltip="'Check Bifrost health'"
      target="_blank"
      rel="noopener noreferrer"
    ) {{ format(row.health?.bfr) }}

    span(v-if="isField('p2p')" :class="classFn('p2p')") {{ format(row.health?.p2p) }}
    span(v-if="isField('b2b')" :class="classFn('b2b')") {{ format(row.health?.b2b) }}
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
      required: true
    },
    column: {
      type: Object,
      required: true
    }
  },
  methods: {
    isField(field) {
      return this.column.field === `health.${field}`
    },
    classFn(field) {
      const service = this.row.health?.[field] ?? ''
      return { up: service.match(/1.2/), down: service.match(/1.3|2.3/) }
    },
    format(val) {
      if (!val) return 'N/A'
      if (val === 'UP') return '*'
      if (val === 'DOWN') return 'BAD'
      return val
        .replace('UP ', '')
        .replace('DOWN ', '')
        .replace('1/3', '⅓↓')
        .replace('2/3', '⅔↓')
        .replace('1/2', '½↑')
    }
  }
}
</script>
