<template lang="pug">
.tix(v-tooltip="location.isp")
  component.sfg(v-if="location.ispIcon" :is="location.ispIcon")
  span(v-else) -
</template>

<script>
export default {
  props: {
    location: {
      type: Object,
      required: true
    }
  }
}
</script>
