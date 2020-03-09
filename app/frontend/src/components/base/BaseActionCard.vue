<template>
  <router-link class="action-link" :to="{ name: linkName, params: linkParams }">
    <v-card class="action-card" max-width="344">
      <slot></slot>
    </v-card>
  </router-link>
</template>

<script>
export default {
  name: 'BaseActionCard',
  props: {
    linkName: String,
    linkParams: Object
  }
};
</script>

<style scoped>
.v-card .action-card {
  background-color: #003366;
  border-top: 10px;
}
</style>
