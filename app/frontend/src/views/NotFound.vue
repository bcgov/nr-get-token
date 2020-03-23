<template>
  <v-container class="not-found text-center">
    <h1 class="mb-10">404: Page not found. :(</h1>
    <router-link :to="{ name: 'About' }">
      <v-btn color="primary" class="about-btn" large>
        <v-icon left>mdi-home</v-icon>
        <span>Return</span>
      </v-btn>
    </router-link>
  </v-container>
</template>

<script>
export default {
  name: 'NotFound'
};
</script>
