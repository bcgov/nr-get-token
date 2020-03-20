<template>
  <div v-if="authenticated">
    <slot />
  </div>
  <div v-else class="text-center">
    <h1 class="mb-10">You must be logged in to use this feature.</h1>
    <v-btn v-if="keycloakReady" color="secondary" class="login-btn" @click="login" large>
      <v-icon left>mdi-login</v-icon>
      <span>Login</span>
    </v-btn>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'BaseSecure',
  computed: {
    ...mapGetters('auth', ['authenticated', 'createLoginUrl', 'keycloakReady'])
  },
  methods: {
    login() {
      if (this.keycloakReady) {
        window.location.replace(this.createLoginUrl());
      }
    }
  }
};
</script>
