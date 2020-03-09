<template>
  <div v-if="$keycloak && $keycloak.ready">
    <v-btn
      v-if="$keycloak.authenticated"
      color="white"
      class="login-btn"
      @click="logout"
      outlined
    >
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
export default {
  name: 'BaseAuthButton',
  methods: {
    login() {
      if (this.$keycloak && this.$keycloak.ready) {
        window.location.replace(this.$keycloak.createLoginUrl());
      }
    },
    logout() {
      if (this.$keycloak && this.$keycloak.ready) {
        window.location.replace(this.$keycloak.createLogoutUrl());
      }
    }
  }
};
</script>
