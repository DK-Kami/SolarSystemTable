<template>
  <div>
    {{ currentBody }}
  </div>
</template>

<script>
export default {
  name: 'ViewPage',

  async created() {
    const { id } = this.$route.params;
    await this.$store.dispatch('loadBody', id);
  },

  computed: {
    currentBody() {
      return this.$store.getters['getCurrentBody'];
    },
  },
};
</script>
