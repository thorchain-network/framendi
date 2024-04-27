<template lang="pug">
.msg
  .text {{ subject }} copied to clipboard!
  .address {{ body }}
</template>

<script>
export default {
  props: {
    subject: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.msg {
  margin: 0 6px;
}

.address {
  font-weight: bold;
  margin-top: 6px;
}
</style>
