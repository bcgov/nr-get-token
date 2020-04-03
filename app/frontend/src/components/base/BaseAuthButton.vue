<template>
  <div v-if="keycloakReady">
    <v-btn v-if="authenticated" class="BC-Gov-PrimaryButton dark" text @click="logout" outlined>
      <span>Logout</span>
    </v-btn>
    <v-btn v-else class="BC-Gov-PrimaryButton dark" text @click="login" outlined>
      <span>Login</span>
    </v-btn>
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
