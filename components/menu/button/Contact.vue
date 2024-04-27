<template lang="pug">
a#btn-contact.buitoni(
  v-tooltip="'Get in Touch'"
  :href="getInTouchLink"
  target="_blank"
  rel="noopener noreferrer"
)
  IconContact
</template>

<script>
export default {
  computed: {
    getInTouchLink() {
      return process.env.twitterContact
    }
  }
}
</script>
