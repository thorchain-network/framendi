<template lang="pug">
.tix
  .tix(v-if="row.jail.reason === '-'") -
  VTooltip(v-else theme="datatable")
    .tix: component.sfg(:is="`Icon${row.jail.icon}`")
    template(#popper)
      .reason.upcase.bold {{ row.jail.reason }}
      .info
        IconJail
        |
        | Release in
      .time {{ row.jail.time }}
      .block {{ row.jail.block }}
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
      required: true
    }
  }
}
</script>
