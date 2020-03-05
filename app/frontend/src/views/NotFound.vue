<template>
  <v-container class="not-found text-center">
    <h1>404: Page not found. :(</h1>
    <router-link :to="{ name: 'Home' }">
      <v-btn color="primary" class="home-btn" id="not-found-home" large>
        <v-icon left>mdi-home</v-icon>
        <span>Home</span>
      </v-btn>
    </router-link>
  </v-container>
</template>

<script>
export default {
  name: 'NotFound'
};
</script>
