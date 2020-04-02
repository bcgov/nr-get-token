<template>
  <div v-if="keycloakReady">
    <v-btn v-if="authenticated" color="white" class="logout-btn" @click="logout" outlined>Logout</v-btn>
    <v-btn v-else color="white" class="login-btn" @click="login" outlined>Login</v-btn>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'BaseAuthButton',
  computed: {
    ...mapGetters('auth', [
      'authenticated',
      'createLoginUrl',
      'createLogoutUrl',
      'keycloakReady'
    ])
  },
  methods: {
    login() {
      if (this.keycloakReady) {
        window.location.replace(this.createLoginUrl());
      }
    },
    logout() {
      if (this.keycloakReady) {
        window.location.replace(
          this.createLogoutUrl({
            redirectUri: location.origin + location.pathname
          })
        );
      }
    }
  }
};
</script>
