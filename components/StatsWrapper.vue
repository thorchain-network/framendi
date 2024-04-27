<template lang="pug">
.stats-wrapper
  h2.upcase {{ title }}
  .content: slot
  .hr
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>
