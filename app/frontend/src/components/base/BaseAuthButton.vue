<template>
  <div v-if="keycloakReady">
    <v-btn v-if="authenticated" color="white" class="logout-btn" @click="logout" outlined>
      <v-icon :left="$vuetify.breakpoint.smAndUp">mdi-logout</v-icon>
      <span v-if="$vuetify.breakpoint.smAndUp">Logout</span>
    </v-btn>
    <v-btn v-else color="white" class="login-btn" @click="login" outlined>
      <v-icon :left="$vuetify.breakpoint.smAndUp">mdi-login</v-icon>
      <span v-if="$vuetify.breakpoint.smAndUp">Login</span>
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
          this.createLogoutUrl({ redirectUri: location.origin + location.pathname })
        );
      }
    }
  }
};
</script>
