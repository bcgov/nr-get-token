<template>
  <v-container class="home">
    <Welcome />
  </v-container>
</template>

<script>
import Welcome from '@/components/Welcome.vue';
export default {
  name: 'Home',
  components: {
    Welcome
  }
};
</script>
